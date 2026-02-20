'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TriageButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleTriage = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/triage', {
                method: 'POST',
            });

            if (res.ok) {
                const issue = await res.json();
                alert(`Successfully assigned and moved to In Progress: ${issue.title}`);
                router.refresh();
            } else if (res.status === 404) {
                alert('No open issues available for triage.');
            } else {
                alert('An error occurred during triage.');
            }
        } catch (err) {
            alert('Failed to connect to triage API.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleTriage}
            disabled={loading}
            className={`px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            {loading ? 'Triaging...' : 'Triage Next Best Issue'}
        </button>
    );
}
