import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  postProducts,
  putProducts,
  deleteProducts,
} from "../services/rest_api";
import {
  graphGetProductsById,
  graphGetCategories,
  graphPostProduct,
  graphPutProduct,
  graphDeleteProduct,
} from "@/app/services/graphql_api";
import SvarTiderGraf from "./graphs/ResponseGraph";
import SvarTiderData, { metricsData } from "../types/RestDataType";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import MetricsTable from "./resultTable";
import { usePerformance } from "@/hooks/usePerfomance";
import {
  graphGetProducts,
  graphGetProductsByID,
  graphGetProducts_3,
} from "@/app/utils/graphQLTester";
import {
  getProducts,
  getProductsID,
  getProducts_3_tables,
} from "../utils/restTester";
import ChartTest from "./Chart";

const Index = () => {
  const [restPrestandaData, setRestPrestandaData] = useState<SvarTiderData>({});
  const [numOfReq, setNumOfReq] = useState<number>(10);
  const [iterations, setIterations] = useState<number>(1);

  const [metricData, setMetricData] = useState<metricsData | undefined>(
    undefined
  );

  const [restData, setRestData] = useState({
    cpuArr: ["0"],
    ramArr: ["0"],
    responseTime: [0],
    sizeInBytes: [0],
  });

  const [graphqlData, setGraphqlData] = useState({
    cpuArr: [0],
    ramArr: [0],
    responseTime: [0],
    sizeInBytes: [0],
  });

  //#region REST API
  const rest_Products = async () => {
    const results = await getProducts(numOfReq, iterations);
    setRestData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[], // Filtrera bort null-värden
      ramArr: results.ramArr.filter((val) => val !== null) as string[], // Filtrera bort null-värden
      sizeInBytes: results.sizeInBytes,
    });
    console.log("index, rest_Products: ", results);
  };

  const rest_Products_3 = async () => {
    const results = await getProducts_3_tables(numOfReq, iterations);
    console.log("index, rest_products_3: ", results);
  };
  const rest_ProductsID = async () => {
    // const { results, metrics } = await getProductsID(numOfReq);
    // setMetricData(metrics);
    const results = await getProductsID(numOfReq);
    console.log("index, rest_ProductsID: ", results);
  };

  const rest_PostProducts = async () => {
    //const { results, metrics } = await postProducts();
    //console.log("post metricData::::   ", metrics);
    //setMetricData(metrics);
  };

  const rest_PutProducts = async () => {
    //const { results, metrics } = await putProducts();
    //setMetricData(metrics);
  };

  const rest_DeleteProducts = async () => {
    const result = await deleteProducts();
    console.log("index, deleteData", result);
  };

  //#endregion

  //#region GraphQL API

  const graph_getProducts = async () => {
    const results = await graphGetProducts(iterations, numOfReq);
    console.log("iterations: ", iterations);
    console.log("numOfReq: ", numOfReq);
    console.log("index, graph_getProducts: ", results);

    setGraphqlData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr
        .filter((val) => val !== null)
        .map((val) => parseFloat(val as string)),
      ramArr: results.ramArr
        .filter((val) => val !== null)
        .map((val) => parseFloat(val as string)),
      sizeInBytes: results.sizeInBytes,
    });
    const { responseTime, cpuArr, ramArr } = results;
  };

  const graph_GetProducts_3 = async () => {
    const results = await graphGetProducts_3(numOfReq, iterations);
    console.log("index, graph_graph_3", results);
  };

  const graph_GetProductsById = async () => {
    const results = await graphGetProductsByID(numOfReq);
    console.log("results: ", results);
  };

  const graph_GetCategories = async () => {
    const result = await graphGetCategories(numOfReq);
    console.log("index, graph_GetCategories: ", result);
  };

  const graph_PostProduct = async () => {
    const { results, metrics } = await graphPostProduct(numOfReq);
    console.log("metidcData::::   ", metrics);
    setMetricData(metrics);
  };

  const graph_PutProduct = async () => {
    const { results, metrics } = await graphPutProduct(numOfReq);
    console.log("index, graph_PutProduct: ", results);
    setMetricData(metrics);
  };

  const graph_DeleteProduct = async () => {
    const result = await graphDeleteProduct();
    console.log("index, graph_DeleteProduct: ", result);
  };
  //#endregion

  return (
    <SidebarProvider>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                <Card className="@container/card">
                  <CardHeader className="relative">
                    <CardDescription>Number of Requests</CardDescription>
                    <Input
                      type="number"
                      value={numOfReq}
                      onChange={(e) => setNumOfReq(Number(e.target.value))}
                    />
                    <CardDescription>Number of Iterations</CardDescription>
                    <Input
                      type="number"
                      value={iterations}
                      onChange={(e) => setIterations(Number(e.target.value))}
                    />
                  </CardHeader>
                </Card>
                <Card className="@container/card">
                  <CardHeader className="relative">
                    <CardDescription>REST Endpoints</CardDescription>
                    <Button onClick={() => rest_Products()}>
                      GET /products
                    </Button>
                    <Button onClick={() => rest_Products_3()}>
                      GET /products_3
                    </Button>
                    <Button onClick={() => rest_ProductsID()}>
                      GET /products/:id
                    </Button>
                    <Button onClick={() => rest_PostProducts()}>
                      POST /products
                    </Button>
                    <Button onClick={() => rest_PutProducts()}>
                      PUT /products
                    </Button>
                    <Button onClick={() => rest_DeleteProducts()}>
                      DELETE /products
                    </Button>
                  </CardHeader>
                </Card>
                <Card className="@container/card">
                  <CardHeader className="relative">
                    <CardDescription>GraphQL Queries</CardDescription>
                    <Button onClick={() => graph_getProducts()}>
                      getProducts
                    </Button>
                    <Button onClick={() => graph_GetProducts_3()}>
                      getProducts (3 table)
                    </Button>
                    <Button onClick={() => graph_GetProductsById()}>
                      getProduct
                    </Button>
                    {/* <Button onClick={() => graph_GetCategories()}>
                      getCategories
                    </Button> */}
                    <Button onClick={() => graph_PostProduct()}>
                      postProduct
                    </Button>
                    <Button onClick={() => graph_PutProduct()}>
                      putProduct
                    </Button>
                    <Button onClick={() => graph_DeleteProduct()}>
                      deleteProduct
                    </Button>
                  </CardHeader>
                </Card>
              </div>
              <div className="px-4 lg:px-6">
                {metricData ? (
                  <MetricsTable
                    api={metricData.api}
                    averageResponseTime={metricData.avaregeResponseTime}
                    method={metricData.method}
                    numOfReq={metricData.numOfReq}
                    numOfUsers={metricData.numOfUsers}
                    requestsPer10ms={metricData.requestsPer10ms}
                    throughput={metricData.throughput}
                    totalTime={metricData.totalTime}
                  />
                ) : (
                  <p>Loading metrics data...</p>
                )}
              </div>
              <ChartTest
                restData={restData}
                graphqlData={graphqlData}
                iterations={iterations}
                numOfReq={numOfReq}
                title="REST API vs GraphQL Performance"
                description="Comparison of performance metrics between REST and GraphQL"
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
