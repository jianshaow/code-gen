import { ArrowRight } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import MarkdownViewer from '../../../components/Markdown';
import { useSetting } from '../../../context/SettingContext';
import { gen_stream } from '../../../services/backend';
import '../../../styles/Common.css';

export default function Generator() {
  const { template } = useSetting();
  const [requirement, setRequirement] = useState('make an example');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleGenerateStream = async () => {
    gen_stream(template, requirement, (generatedData: string) => {
      setGenerated(generatedData);
      if (codeRef.current) {
        codeRef.current.scrollTop = codeRef.current.scrollHeight;
      }
    });
  };

  return (
    <div className='container'>
      <div className='requirement-block'>
        <label>Requiremenet</label>
        <textarea value={requirement} rows={30}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setRequirement(e.target.value);
          }} />
      </div>
      <div className='container-column'>
        <button onClick={handleGenerateStream} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px 6px' }}>
          <ArrowRight size={20} />
        </button>
      </div>
      <div className='generated-block' ref={codeRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label>Generated Code</label>
          <div>
            {copied && <label className='success'>Copied</label>}
            <button onClick={async () => {
              navigator.clipboard.writeText(generated);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }} style={{ textAlign: 'right' }}>Copy</button>
          </div>
        </div>
        <MarkdownViewer content={generated} style={{ height: 426 }} />
      </div>
    </div>
  );
}
