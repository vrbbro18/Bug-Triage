'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function IssueFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState(searchParams.get('status') || '');
    const [area, setArea] = useState(searchParams.get('area') || '');

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) params.set(name, value);
            else params.delete(name);
            return params.toString();
        },
        [searchParams]
    );

    const handleFilter = (key: string, value: string) => {
        if (key === 'status') setStatus(value);
        if (key === 'area') setArea(value);
        router.push(`/?${createQueryString(key, value)}`);
    };

    return (
        <div className="flex gap-4 items-center">
            <div>
                <label className="text-sm text-gray-600 mr-2">Status:</label>
                <select
                    value={status}
                    onChange={(e) => handleFilter('status', e.target.value)}
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div>
                <label className="text-sm text-gray-600 mr-2">Area:</label>
                <select
                    value={area}
                    onChange={(e) => handleFilter('area', e.target.value)}
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="design">Design</option>
                </select>
            </div>
        </div>
    );
}
