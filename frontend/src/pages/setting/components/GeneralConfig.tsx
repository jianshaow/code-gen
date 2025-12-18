
import { useEffect, useState, type ChangeEvent } from 'react';
import { useSetting } from '../../../context/SettingContext';
import { storeBeBaseUrl } from '../../../services/backend';

export default function GeneralConfigSetting() {
  const settingContext = useSetting();
  const [beBaseUrl, setBeBaseUrl] = useState<string>(settingContext.beBaseUrl);

  function handleSaveBeBaseUrl() {
    storeBeBaseUrl(beBaseUrl);
    alert('Backend Base URL Saved!');
    settingContext.setBeBaseUrl(beBaseUrl);
  }

  const handleDetectBeBaseUrl = async () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}`;
    setBeBaseUrl(url);
  };

  useEffect(() => {
    async function reload() {
      setBeBaseUrl(settingContext.beBaseUrl);
    }
    reload()
  }, [settingContext.beBaseUrl]);

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
                setBeBaseUrl(e.target.value);
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
