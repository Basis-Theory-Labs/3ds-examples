import React, { useState, useEffect } from 'react';
import { Hook as hook, Unhook as unhook, Console } from 'console-feed';

const LogViewer = () => {
  const [logs, setLogs]: any[] = useState([]);

  // run once!
  useEffect(() => {
    const hookedConsole = hook(
      window.console,
      (log) => setLogs((currLogs: any[]) => [...currLogs, log]),
      false
    );

    return () => {
      unhook(hookedConsole);
    };
  }, []);

  return (
    <>
      <h3>{'👇 Logs'}</h3>
      <Console filter={['debug']} logs={logs} variant="dark" />
    </>
  );
};

export { LogViewer };
