import Title from "antd/es/typography/Title";
import { Button, Divider, Typography, Col } from "antd";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { IBasket, IProduct } from "@src/pages/interface";
import { BasketProduct } from "./korzinkaProduct";
import { priceFormatter2 } from "../../Additions/PriceFormat";
import { useEffect, useState } from "react";
import axios from "axios";

export const Basket = () => {
  const navigate = useNavigate();
  const [basket, setBasket] = useState<{
    products: { productId: number; quantity: number }[];
  }>({ products: [] });
  const [products, setProducts] = useState<IProduct[]>([]);
  const [basketLoading, setBasketLoading] = useState<boolean>(true);

  const fetchBasket = async () => {
    setBasketLoading(true); // Loader faollashtirish
    try {
      const res = await axios.get(`https://80a4e112872cbb1a.mokky.dev/basket`);
      setBasket(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setBasketLoading(false); // Loader o'chirish
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `https://80a4e112872cbb1a.mokky.dev/products`
      );
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBasket();
    fetchProducts();
  }, []);

  if (basketLoading)
    return (
      <Col lg={24}>
        <div className="bg-white rounded-lg p-3">
          <div className="flex justify-between mb-2">
            <Title level={4}>Корзина</Title>
            <div
              className="bg-[#F2F2F3] w-10 h-7 flex justify-center items-center"
              style={{ borderRadius: "6px" }}
            >
              0
            </div>
          </div>
          <Title level={5}>Загрузка...</Title>
        </div>
      </Col>
    );

  const userId = Number(localStorage.getItem("userId")); // localStorage dan userId ni olish
  //@ts-ignore
  const userBasket = basket.find((b: IBasket) => b.userId === userId); // Faqat ushbu userId ga tegishli basketni olish

  const basketItems =
    userBasket?.products
      ?.map((item: IBasket) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean) || []; // Agar ma'lumot bo‘lmasa, bo‘sh massiv qaytarish

  const totalPrice = basketItems.reduce(
    (sum: number, item: IBasket) =>
      sum + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  return (
    <Col lg={24}>
      <div className="bg-white rounded-lg p-3">
        <div className="flex justify-between mb-2">
          <Title level={4}>Корзина</Title>
          <div
            className="bg-[#F2F2F3] w-10 h-7 flex justify-center items-center"
            style={{ borderRadius: "6px" }}
          >
            {basketItems.length}
          </div>
        </div>
        <>
          {basketItems.length > 0 ? (
            <>
              <Divider style={{ marginBlock: "0px" }} />
              {basketItems.map((b) => (
                <div key={b.id} className="flex flex-col gap-2 mt-5">
                  <BasketProduct product={b} quantity={b.quantity} />
                  <Divider style={{ marginBlock: "5px" }} />
                </div>
              ))}
              <div className="flex justify-between items-center mb-2 font-bold">
                <p className="text-lg">Итого</p>
                <p className="text-lg">{priceFormatter2(totalPrice)} ₽</p>
              </div>
              <Button
                className="w-full mt-2 bg-[#FF7020] text-white rounded-xl py-5"
                type="text"
                onClick={() =>
                  navigate("?" + queryString.stringify({ submit: true }))
                }
              >
                Оформить заказ
              </Button>
              <div className="flex gap-2 mt-2">
                <img
                  src="https://cdn-icons-png.freepik.com/512/2362/2362252.png"
                  alt=""
                  style={{ width: "20px" }}
                />
                <Typography>Бесплатная доставка</Typography>
              </div>
            </>
          ) : (
            <Title level={5}>Тут пока пусто :(</Title>
          )}
        </>
      </div>
    </Col>
  );
};
