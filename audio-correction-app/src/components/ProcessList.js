import React from 'react';
import { useAppContext } from '../App';

const ProcessList = () => {
    const { processes } = useAppContext();

    return (
        <div>
            <h2>Processes</h2>
            <ul>
                {processes.map((process) => (
                    <li key={process.id}>
                        <div>
                            <strong>Email:</strong> {process.email}
                        </div>
                        <div>
                            <strong>Status:</strong> {process.status}
                        </div>
                        {process.correctedFilePath && (
                            <div>
                                <audio controls>
                                    <source src={process.correctedFilePath} type="audio/wav" />
                                </audio>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProcessList;
