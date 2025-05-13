import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SvarTiderData, { metricsData } from "../types/RestDataType";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import MetricsTable from "./resultTable";
import ApiComparisonChart from "./graphs/ApiComparisonChart";
import {
  graphGetProducts,
  graphGetProductsByID,
  graphGetProducts_3,
  graphPostProduct,
  graphPostProduct_3,
  graph_getProducts_2_fields,
  graphDeleteProduct,
  graphPutProduct,
} from "@/app/utils/graphQLTester";
import {
  getProducts,
  getProductsID,
  getProducts_3_tables,
  postProducts,
  postProducts_3,
  getProducts_2_fields,
  restDeleteProduct,
} from "../utils/restTester";
import ChartTest from "./Chart";

const Index = () => {
  //#region VARIABLES
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

  // Transform performance data for ApiComparisonChart
  const performanceData = {
    rounds: restData.cpuArr.map((_, index) => ({
      round: index + 1,
      rest: {
        cpu: parseFloat(restData.cpuArr[index] || "0"),
        ram: parseFloat(restData.ramArr[index] || "0"),
        responseTime: restData.responseTime[index] || 0,
        sizeInBytes: restData.sizeInBytes[index] || 0,
      },
      graphql: {
        cpu: graphqlData.cpuArr[index] || 0,
        ram: graphqlData.ramArr[index] || 0,
        responseTime: graphqlData.responseTime[index] || 0,
        sizeInBytes: graphqlData.sizeInBytes[index] || 0,
      },
    })),
  };

  //#endregion

  //#region REST API
  const rest_Products = async () => {
    const results = await getProducts(iterations, numOfReq);
    setRestData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[],
      ramArr: results.ramArr.filter((val) => val !== null) as string[],
      sizeInBytes: results.sizeInBytes,
    });
    console.log("index, rest_Products: ", results);
  };

  const rest_Products_3 = async () => {
    const results = await getProducts_3_tables(numOfReq, iterations);
    setRestData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[],
      ramArr: results.ramArr.filter((val) => val !== null) as string[],
      sizeInBytes: results.sizeInBytes,
    });
    console.log("index, rest_products_3: ", results);
  };
  const rest_ProductsID = async () => {
    const results = await getProductsID(iterations, numOfReq);
    setRestData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[],
      ramArr: results.ramArr.filter((val) => val !== null) as string[],
      sizeInBytes: results.sizeInBytes,
    });
    console.log("index, rest_ProductsID: ", results);
  };

  const rest_Products_2_fields = async () => {
    const results = await getProducts_2_fields(iterations, numOfReq);
    setRestData({
      responseTime: [results.totalDuration],
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[],
      ramArr: results.ramArr.filter((val) => val !== null) as string[],
      sizeInBytes: results.sizeInBytes,
    });
    console.log("index, rest_Products: ", results);
  };

  const rest_PostProducts = async () => {
    const results = await postProducts(iterations, numOfReq);
    console.log("index, rest_postProduct   ", results);
    setRestData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[],
      ramArr: results.ramArr.filter((val) => val !== null) as string[],
      sizeInBytes: results.sizeInBytes,
    });
  };

  const rest_PostProducts_3 = async () => {
    const results = await postProducts_3(iterations, numOfReq);
    console.log("index, rest_postProduct_3  ", results);
    setRestData({
      responseTime: results.responseTime,
      cpuArr: results.cpuArr.filter((val) => val !== null) as string[],
      ramArr: results.ramArr.filter((val) => val !== null) as string[],
      sizeInBytes: results.sizeInBytes,
    });
  };

  const rest_PutProducts = async () => {
    //const { results, metrics } = await putProducts(iterations, numOfReq);
    //setMetricData(metrics);
  };

  const rest_DeleteProducts = async () => {
    const result = await restDeleteProduct(iterations, numOfReq);
    console.log("index, deleteData", result);
  };

  //#endregion

  //#region GraphQL API

  const graph_getProducts = async () => {
    const results = await graphGetProducts(iterations, numOfReq);
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
    const results = await graphGetProducts_3(iterations, numOfReq);
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
    console.log("index, graph_graph_3", results);
  };

  const graph_GetProductsById = async () => {
    const results = await graphGetProductsByID(iterations, numOfReq);
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
    console.log("results: ", results);
  };

  const graph_GetProducts_2_fields = async () => {
    const results = await graph_getProducts_2_fields(iterations, numOfReq);

    console.log("index, graph_getProduct_2_fields", results);
    setGraphqlData({
      responseTime: [results.totalDuration],
      cpuArr: results.cpuArr
        .filter((val) => val !== null)
        .map((val) => parseFloat(val as string)),
      ramArr: results.ramArr
        .filter((val) => val !== null)
        .map((val) => parseFloat(val as string)),
      sizeInBytes: results.sizeInBytes,
    });
  };

  const graph_PostProduct = async () => {
    const results = await graphPostProduct(iterations, numOfReq);

    console.log("index, graph_postProduct ", results);
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
  };

  const graph_PostProduct_3 = async () => {
    const results = await graphPostProduct_3(iterations, numOfReq);
    console.log("index, graph_postProduct_3 ", results);
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
  };
  const graph_PutProduct = async () => {
    const results = await graphPutProduct(iterations, numOfReq);
  };

  const graph_DeleteProduct = async () => {
    const result = await graphDeleteProduct(iterations, numOfReq);
    console.log("index, graph_DeleteProduct: ", result);
  };
  //#endregion

  //#region RETURN

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
                    <Button onClick={() => rest_Products_2_fields()}>
                      GET /product_2_fields
                    </Button>
                    <Button onClick={() => rest_PostProducts()}>
                      POST /products
                    </Button>
                    <Button onClick={() => rest_PostProducts_3()}>
                      POST /products_3
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
                    <Button onClick={() => graph_GetProducts_2_fields()}>
                      getProducts 2 fields
                    </Button>
                    {/* <Button onClick={() => graph_GetCategories()}>
                      getCategories
                    </Button> */}
                    <Button onClick={() => graph_PostProduct()}>
                      postProduct
                    </Button>
                    <Button onClick={() => graph_PostProduct_3()}>
                      postProduct (3 tabels)
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
                <ApiComparisonChart apiData={performanceData} />
              </div>
              <div className="px-4 lg:px-6">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

//#endregion
export default Index;
