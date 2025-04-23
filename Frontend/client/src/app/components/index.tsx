import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getProducts,
  getProductsID,
  postProducts,
  putProducts,
  deleteProducts,
} from "../services/rest_api";
import {
  graphGetProducts,
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
import { set } from "zod";

const Index = () => {
  const [restPrestandaData, setRestPrestandaData] = useState<SvarTiderData>({});
  const [numOfReq, setNumOfReq] = useState<number>(10);
  const [numOfUsers, setNumOfUsers] = useState<number>(10);
  const [ID, setID] = useState<number>(1);

  const [metricData, setMetricData] = useState<metricsData | undefined>(
    undefined
  );

  //#region REST API
  const rest_Products = async () => {
    const { results, metrics } = await getProducts(numOfReq, numOfUsers);
    setMetricData(metrics);
  };

  const rest_ProductsID = async () => {
    const { results, metrics } = await getProductsID(ID, numOfUsers);
    setMetricData(metrics);
  };

  const rest_PostProducts = async () => {
    const { results, metrics } = await postProducts(numOfUsers);
    console.log("post metricData::::   ", metrics);
    setMetricData(metrics);
  };

  const rest_PutProducts = async () => {
    const result = await putProducts(ID);
    console.log("index, putData", result);
  };

  const rest_DeleteProducts = async () => {
    const result = await deleteProducts(ID);
    console.log("index, deleteData", result);
  };

  //#endregion

  //#region GraphQL API
  const graph_GetProducts = async () => {
    const { results, metrics } = await graphGetProducts(numOfReq, numOfUsers);
    setMetricData(metrics);
  };

  const graph_GetProductsById = async () => {
    const result = await graphGetProductsById(ID);
    console.log("index, graph_GetProductsById: ", result);
  };

  const graph_GetCategories = async () => {
    const result = await graphGetCategories(numOfReq);
    console.log("index, graph_GetCategories: ", result);
  };

  const graph_PostProduct = async () => {
    const result = await graphPostProduct(numOfReq);
    console.log("index, graph_PostProduct: ", result);
  };

  const graph_PutProduct = async () => {
    const result = await graphPutProduct(ID);
    console.log("index, graph_PutProduct: ", result);
  };

  const graph_DeleteProduct = async () => {
    const result = await graphDeleteProduct(ID);
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
                    <CardDescription>ID</CardDescription>
                    <Input
                      type="number"
                      value={ID}
                      onChange={(e) => setID(Number(e.target.value))}
                    />
                    <CardDescription>Number of Users</CardDescription>
                    <Input
                      type="number"
                      value={numOfUsers}
                      onChange={(e) => setNumOfUsers(Number(e.target.value))}
                    />
                  </CardHeader>
                </Card>
                <Card className="@container/card">
                  <CardHeader className="relative">
                    <CardDescription>REST Endpoints</CardDescription>
                    <Button onClick={() => rest_Products()}>
                      GET /products
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
                    <Button onClick={() => graph_GetProducts()}>
                      getProducts
                    </Button>
                    <Button onClick={() => graph_GetProductsById()}>
                      getProduct
                    </Button>
                    <Button onClick={() => graph_GetCategories()}>
                      getCategories
                    </Button>
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
