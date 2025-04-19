'use client';

import { useState } from 'react';
import { measureResponseTime, PerformanceResult } from '@/lib/api/fetch-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ApiPerformanceCard() {
    const [data, setData] = useState<PerformanceResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRunTest = async () => {
        setLoading(true);
        const result = await measureResponseTime('GraphQL', 20, 5); // Du kan byta till 'REST'
        setData(result);
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>API Prestandatest</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleRunTest} disabled={loading}>
                        {loading ? 'Kör test...' : 'Kör GraphQL-test'}
                    </Button>

                    {loading && <Skeleton className="w-full h-20 rounded-lg" />}

                    {data && (
                        <div className="space-y-6">
                            <Card className="border">
                                <CardHeader>
                                    <CardTitle>Statistik ({data.apiType})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid grid-cols-2 gap-4 text-sm">
                                        <li>📊 Snitt: <strong>{data.stats.average} ms</strong></li>
                                        <li>⚡ Min: <strong>{data.stats.min} ms</strong></li>
                                        <li>🐢 Max: <strong>{data.stats.max} ms</strong></li>
                                        <li>✅ Lyckade: <strong>{(data.stats.successRate * 100).toFixed(0)}%</strong></li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="overflow-x-auto">
                                <CardHeader>
                                    <CardTitle>Individuella anrop</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Tid (ms)</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Tidpunkt</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.results.map((res, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell>{res.duration}</TableCell>
                                                    <TableCell>{res.success ? '✅' : '❌'}</TableCell>
                                                    <TableCell>{new Date(res.timestamp).toLocaleTimeString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Diagram</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <BarChart width={600} height={300} data={data.results}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="timestamp"
                                                tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="duration" fill="#4f46e5" />
                                        </BarChart>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}