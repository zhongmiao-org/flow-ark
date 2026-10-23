"""Seal the same-session initialization extension without changing old snapshots."""
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
source, target = root / 'v0.51.0', root / 'v0.52.0'
if target.exists():
    raise SystemExit('Refuse to overwrite a snapshot')
for line in (source / 'SHA256SUMS').read_text().splitlines():
    checksum, name = line.split('  ', 1)
    assert hashlib.sha256((source / name).read_bytes()).hexdigest() == checksum, name
shutil.copytree(source, target)
schema = json.loads((target / 'p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.52.0/p1.schema.json'
schema['$defs']['BatchDeclaration']['properties']['initializationSteps'] = {
    'type': 'array', 'minItems': 1, 'maxItems': 1000, 'uniqueItems': True,
    'items': {'type': 'string', 'pattern': '^[A-Za-z0-9_-]{1,100}$'},
}
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
p = target / 'entry-batch-decision.mjs'
body = p.read_text().replace(
    "!exact(declaration, ['version', 'decisionPath', 'progressPath', 'reasonPath'])",
    "!exact(declaration, ['version', 'decisionPath', 'progressPath', 'reasonPath', ...(owns(declaration, 'initializationSteps') ? ['initializationSteps'] : [])])",
)
body = body.replace("  const paths = [declaration.decisionPath", "  if (owns(declaration, 'initializationSteps') && (!Array.isArray(declaration.initializationSteps) || !declaration.initializationSteps.length || declaration.initializationSteps.length > 1000 || new Set(declaration.initializationSteps).size !== declaration.initializationSteps.length || declaration.initializationSteps.some(id => typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(id)))) throw Error('仅首次执行步骤声明无效');\n  const paths = [declaration.decisionPath")
body += '''
/** Selected nodes must be unique, outside item loops, and not overlap. */
export function assertBatchInitialization(declaration, flow) {
  const selected = declaration?.initializationSteps ?? [];
  const wanted = new Set(selected), found = new Set();
  function visit(nodes, inLoop = false, selectedParent = false) {
    for (const node of nodes) {
      const chosen = wanted.has(node.id);
      if (chosen) {
        if (inLoop || selectedParent || found.has(node.id) || node.type === 'loop')
          throw Error('仅首次执行步骤不能位于循环内、包含循环或相互嵌套');
        found.add(node.id);
      }
      if (node.type === 'loop') {
        if (selectedParent || chosen) throw Error('初始化步骤不能包含循环');
        visit(node.body, true, selectedParent || chosen);
      }
      if (node.type === 'condition') {
        visit(node.then, inLoop, selectedParent || chosen);
        visit(node.else, inLoop, selectedParent || chosen);
      }
    }
  }
  visit(flow.steps);
  if (found.size !== wanted.size) throw Error('仅首次执行步骤已删除，请重新选择');
}
'''
p.write_text(body)
p = target / 'entry-batch-decision.d.mts'
p.write_text(p.read_text().replace('  version: 1;', '  initializationSteps?: string[];\n  version: 1;', 1) + '\nexport function assertBatchInitialization(declaration: BatchDeclaration | undefined, flow: {steps: unknown[]}): void;\n')
p = target / 'entry-batches.ts'
body = p.read_text().replace('assertBatchDeclaration, batchCapability', 'assertBatchDeclaration, assertBatchInitialization, batchCapability')
body = body.replace('  if (present) assertBatchDeclaration(entry.batching, resultSchema);', '''  if (present) assertBatchDeclaration(entry.batching, resultSchema);
  const initializes = !!entry.batching?.initializationSteps?.length;
  if (initializes !== entry.capabilities.includes('entry-initialization-v1'))
    fail('仅首次执行步骤与能力声明须同时存在');
  if (entry.flow && typeof entry.flow === 'object') assertBatchInitialization(entry.batching, entry.flow);''')
p.write_text(body)
(target / 'batch-initialization.md').write_text('''# 同一连续会话的初始化结果复用

2026-10-23。`BatchDeclaration.initializationSteps` 可选；存在时入口另声明 `entry-initialization-v1`。普通单次运行保持原行为。作者通过步骤多选器配置，公开包仅携带步骤 ID，不携带初始化值。

所选步骤必须存在、唯一、不重叠，不得处于循环内或包含循环。首次完整成功执行的批次提供结果；未执行分支不凭空制造结果。后续批次跳过所选步骤的执行，并在原作用域恢复完整结果；没有实际首批结果的所选步骤若后续进入则停止，不能补做初始化。真实动作前的当前账号、城市、页面、去重和权限核对留在循环内。

宿主仅在同一活进程、同一连续会话、固定流程/资源/配置/权限范围内读取首批来源。原 Run 必须成功，来源包含版本、原 Run、会话、范围摘要、完整步骤结果及值摘要。原值以受保护记录保存，按 entry-reuse 家族登记并计入首批既有 8 MiB 总预算；后续快照只存来源引用，不能复制到未计量的私有会话记录。读取前核对原账本、完整摘要、唯一批次和固定来源；不从脱敏显示或截断汇总恢复。失败、未知、取消、范围改变或进程退出停止原会话；重启不自动接续，不跨会话复用。

内部 Worker 仅接收宿主核验的完整初值，返回本批完整输出与实际首次步骤结果。初始化复用不产生伪造的执行成功事件；运行说明标明复用首批结果。各批仍保存完整回执并经过原准入检查，容量不增加、不截断历史、不重放未知外发。模板的 continue/complete/review 和进度映射保持；只有网站实际每日上限证据才由 BOSS 模板返回 complete，本地计数与候选耗尽不代表完成。

本版本不新增通用规划、业务专属节点或聊天能力；尚未安装和真实网站验收，不将设计或格式检查视为业务完成。
''')
(target / 'README.md').write_text('# 0.52.0 同会话初始化复用候选\n\n继承 0.51.0，追加可选初始化步骤及能力声明，详见 [契约](batch-initialization.md)。当前候选，尚未发布、安装或业务验收。旧快照不改写；包与 SDK 版本不变。\n')
files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in {'README.md', 'SHA256SUMS'})
(target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
print('Sealed', len(files), 'machine files')
