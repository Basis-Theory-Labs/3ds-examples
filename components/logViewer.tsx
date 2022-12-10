import {useState, useEffect} from "react";
import { Hook, Unhook, Console } from 'console-feed'


export default function LogViewer() {
    const [logs, setLogs]: any[] = useState([])

    // run once!
    useEffect(() => {
        const hookedConsole = Hook(
            window.console,
            (log) => setLogs((currLogs: any[]) => [...currLogs, log]),
            false
        )
        return () => { Unhook(hookedConsole) }
    }, [])

    return (<Console logs={logs} variant="dark" filter={['debug']} />)
}
