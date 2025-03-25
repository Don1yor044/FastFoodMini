import { Col, Result, Row, Segmented, Skeleton } from "antd";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Footer from "./HomeComponents/footer";
import { Basket } from "./HomeComponents/basket";
import { DeliveryModal } from "./HomeComponents/deliveryModal";
import Headers from "./HomeComponents/headers";
import axios from "axios";
import { Product } from "./HomeComponents/product";
import { ICategory, IProduct } from "../interface";
import { ThreeDot } from "react-loading-indicators";
import { ProductsModal } from "./HomeComponents/ordersModal";

export const HomePage = () => {
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const res = await axios.get(
        `https://80a4e112872cbb1a.mokky.dev/categories`
      );
      setCategory(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCategoryLoading(false);
    }
  };
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await axios.get(
        `https://80a4e112872cbb1a.mokky.dev/products?categoryId=${categoryId}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (value: number) => {
    setCategoryId(value);
  };
  return (
    <>
      <div style={{ backgroundColor: "#f6f5f5", paddingBottom: "10px" }}>
        <Headers />
        <div>
          <SegmentedStyled>
            <div className="min-w-full">
              <div
                className="flex gap-8"
                style={{
                  marginTop: 20,
                }}
              >
                {!categoryLoading ? (
                  <Segmented
                    options={category.map((cat: ICategory) => ({
                      label: (
                        <div className="flex px-4 gap-2 !items-center">
                          <img
                            src={cat.icon}
                            alt=""
                            className="object-cover w-7 h-7"
                          />
                          <div>{cat.title}</div>
                        </div>
                      ),
                      value: cat.id,
                      className:
                        "block min-w-[120px] bg-white hover:!bg-white !rounded-2xl",
                    }))}
                    style={{
                      padding: "0px 80px",
                      marginTop: 20,
                    }}
                    onChange={handleChange}
                  />
                ) : (
                  Array.from({ length: 9 }).map((_, index) => (
                    <Skeleton.Button
                      key={index}
                      active
                      size="large"
                      style={{ width: 120, height: 38, borderRadius: 30 }}
                    />
                  ))
                )}
              </div>
            </div>
          </SegmentedStyled>
        </div>

        <div className="my-10 mx-auto px-2 lg:px-5 ">
          {/* Korzinka s */}
          <Row
            gutter={[15, 20]}
            className="lg:px-8 px-5"
            style={{ overflow: "hidden", margin: 0 }}
          >
            <Col xl={6} className="pt-5">
              <Basket />
            </Col>

            {/* Product  */}
            <Col xl={18}>
              {productsLoading ? (
                <div className="ps-20">
                  <ThreeDot
                    variant="bob"
                    color="#ffab08"
                    size="medium"
                    text=""
                    textColor=""
                  />{" "}
                </div>
              ) : (
                <>
                  <Row gutter={[20, 20]}>
                    {products && products.length > 0 ? (
                      products.map((item: IProduct, index: number) => (
                        <Product key={item.id} item={item} index={index} />
                      ))
                    ) : (
                      <Col span={20} className="h-96">
                        <Result
                          title="Извините, в этой категории нет товаров"
                          className="p-20"
                        />
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
      {/* zakaz modal  */}
      <ProductsModal products={products} />

      {/* dastafka modal  */}
      <DeliveryModal />
    </>
  );
};

const SegmentedStyled = styled.div`
  .ant-segmented-thumb {
    border-radius: 50px !important;
  }
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  .ant-segmented-item {
    border-radius: 20px;
    background-color: white;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 50px !important;
    color: black;

    &:active,
    &:focus {
      background-color: #ffab08;
    }
  }
  .ant-segmented-item-selected {
    background-color: #ffab08 !important;
    color: white;
  }
  .ant-segmented-item-label {
    padding: 5px 0px;
  }
  .ant-segmented-group {
    display: flex;
    gap: 30px;
    overflow: auto;
    max-width: 1330px;
  }
`;
