'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartAreaInteractive, PerformanceDataPoint } from "@/components/chart-area-interactive";
import { DataTable } from '@/components/data-table';
import ApiPerformanceCard from '@/app/components/chart';

//restAPI services
import { restGetProducts } from './services/restAPI';

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { measureResponseTime } from '@/lib/api/fetch-data';
import graphQLFetchProductID from '@/lib/api/graphQL-fetch';
import { ChevronsUp } from 'lucide-react';

import HomePage from '@/app/components/index'

export default function Page() {
  const [performanceData, setPerformanceData] = React.useState<PerformanceDataPoint[]>([]);
  const [apiResults, setApiResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<{
    REST: boolean;
    GraphQL: boolean;
  }>({ REST: false, GraphQL: false });

  // Function to run performance tests
  const runPerformanceTest = async (apiType: 'REST' | 'GraphQL', numRequests: number = 10, concurrency: number = 2) => {
    try {
      setIsLoading(prev => ({ ...prev, [apiType]: true }));

      const result = await measureResponseTime(apiType, numRequests, concurrency);

      // Update chart data with new measurements
      setPerformanceData(prev => {
        // Convert results to format required by chart
        const newPoints = result.results.map(item => ({
          timestamp: item.timestamp,
          REST: apiType === 'REST' ? item.duration : null,
          GraphQL: apiType === 'GraphQL' ? item.duration : null
        }));

        return [...prev, ...newPoints];
      });

      // Update table data
      setApiResults(prev => [
        ...prev,
        ...result.results.map(item => ({
          endpoint: apiType === 'REST' ? '/getProducts' : '/graphql',
          method: apiType === 'REST' ? 'GET' : 'POST',
          responseTime: item.duration,
          status: item.success ? 'success' : 'error',
          timestamp: new Date(item.timestamp).toISOString(),
          apiType
        }))
      ]);

      console.log(`${apiType} Performance Results:`, result.stats);
    } catch (error) {
      console.error("Performance test error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, [apiType]: false }));
    }
  };

  // Add some initial data on component mount
  React.useEffect(() => {
    const now = Date.now();
    const initialData: PerformanceDataPoint[] = [
      {
        timestamp: now - 25 * 60 * 1000, // 25 minutes ago
        REST: 220,
        GraphQL: null
      },
      {
        timestamp: now - 20 * 60 * 1000, // 20 minutes ago
        REST: null,
        GraphQL: 180
      },
      {
        timestamp: now - 15 * 60 * 1000, // 15 minutes ago
        REST: 240,
        GraphQL: null
      },
      {
        timestamp: now - 10 * 60 * 1000, // 10 minutes ago
        REST: null,
        GraphQL: 160
      }
    ];

    setPerformanceData(initialData);
  }, []);
  type Product = {
    id: number;
    namn: string;
    pris: string;
    beskrivning: string;
    artikelnummer: string;
    lagerantal: number;
    vikt: number;
    kategoriID: number;
  };
  const handleClick = async () => {
    const data = await graphQLFetchProductID();
    console.log("Produkter:");
  };

  //REST GET till /products
  const clickGetProducts = async () => {
    const data = await restGetProducts();
    console.log("data:", data.data);
  }

  //REST POST till /products
  const clickPostProducts = async () => {

  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex gap-4 mb-4">
                  <Button
                    onClick={() => runPerformanceTest('REST')}
                    disabled={isLoading.REST}
                  >
                    {isLoading.REST ? 'Testing REST...' : 'Test REST API'}
                  </Button>
                  <Button
                    onClick={() => runPerformanceTest('GraphQL')}
                    disabled={isLoading.GraphQL}
                  >
                    {isLoading.GraphQL ? 'Testing GraphQL...' : 'Test GraphQL API'}
                  </Button>
                </div>
                <div className="flex gap-4 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      runPerformanceTest('REST', 50, 10);
                    }}
                    disabled={isLoading.REST}
                  >
                    REST Load Test (50 reqs)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      runPerformanceTest('GraphQL', 50, 10);
                    }}
                    disabled={isLoading.GraphQL}
                  >
                    GraphQL Load Test (50 reqs)
                  </Button>

                  <Button onClick={handleClick}>
                    testKnapp
                  </Button>
                  <Button onClick={clickGetProducts}>
                    GET till /products
                  </Button>
                  <Button>
                    POST till /products
                  </Button>
                  <Button>
                    Delete till /products?id=
                  </Button>
                  <Button>
                    GET till /product?id=
                  </Button>
                </div>
                <ChartAreaInteractive data={performanceData} />
                <ApiPerformanceCard />
                < HomePage />

              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}