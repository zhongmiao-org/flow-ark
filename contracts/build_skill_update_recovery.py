"""Build the Skill apply recovery patch from immutable 0.37.0."""
import argparse,copy,hashlib,json,shutil
from pathlib import Path
root=Path(__file__).parent
maintained=root/'v0.37.1'
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,default=maintained);target=p.parse_args().output
if (target/'SHA256SUMS').exists(): raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True,exist_ok=True)
for source in (root/'v0.37.0').iterdir():
 if source.name not in ('README.md','SHA256SUMS','p1.schema.json'):shutil.copyfile(source,target/source.name)
if target.resolve()!=maintained.resolve():
 for n in ('skill-update-application.ts','skill-update-application.cases.json','example.skill-update-application.json','README.md'):shutil.copyfile(maintained/n,target/n)
schema=json.loads((root/'v0.37.0/p1.schema.json').read_text());schema['$id']='https://flowark.local/contracts/0.37.1/p1.schema.json';d=schema['$defs']
def ref(n):return {'$ref':'#/$defs/'+n}
def nullable(v):return {'anyOf':[v,{'type':'null'}]}
def obj(v):return {'type':'object','properties':v,'required':list(v),'additionalProperties':False}
d['SkillUpdateApplication']=obj({'status':{'enum':['pending','applied','rejected']},'input':ref('SkillUpdateApply'),'receipt':nullable(ref('SkillUpdateReceipt'))})
d['SkillUpdateApplication']['allOf']=[{'if':{'properties':{'status':{'const':'applied'}}},'then':{'properties':{'receipt':ref('SkillUpdateReceipt')}},'else':{'properties':{'receipt':{'type':'null'}}}}]
d['SkillUpdateDetail']=obj({'proposal':ref('SkillProposalSnapshot'),'workspace':{'type':'string','minLength':1,'maxLength':4096},'application':nullable(ref('SkillUpdateApplication'))})
(target/'p1.schema.json').write_text(json.dumps(schema,ensure_ascii=False,indent=2)+'\n')
if all((target/n).exists() for n in ('skill-update-application.ts','skill-update-application.cases.json','example.skill-update-application.json','README.md')):
 files=sorted(x for x in target.iterdir() if x.is_file() and x.name not in ('README.md','SHA256SUMS'))
 (target/'SHA256SUMS').write_text(''.join(hashlib.sha256(x.read_bytes()).hexdigest()+'  '+x.name+'\n' for x in files));print('Sealed',len(files),'candidate machine files.')
else: print('Candidate schema generated; references and examples still required.')
