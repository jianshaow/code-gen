import { useState, type ChangeEvent } from 'react';
import { getBeBaseUrl, setBeBaseUrl } from '../../../services/backend';

export default function GeneralConfigSetting({ onChange }: { onChange?: () => void }) {
  const [beBaseUrl, setBeBaseUrlState] = useState(getBeBaseUrl());

  const handleSaveBeBaseUrl = async () => {
    setBeBaseUrl(beBaseUrl);
    onChange && onChange();
  };

  const handleDetectBeBaseUrl = async () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}`;
    setBeBaseUrlState(url);
  };

  return (
    <>
      <label className='title'>General</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>Backend Base URL: </label>
            <input
              type='text'
              value={beBaseUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setBeBaseUrlState(e.target.value);
              }}
            />
            <button onClick={handleSaveBeBaseUrl}>Save</button>
            <button onClick={handleDetectBeBaseUrl}>Detect</button>
          </div>
        </div>
      </div>
    </>
  );
}
