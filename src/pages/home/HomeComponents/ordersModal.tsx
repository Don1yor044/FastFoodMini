import Title from "antd/es/typography/Title";
import { Button, message, Modal, Typography } from "antd";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IProduct } from "@src/pages/interface";
import { priceFormatter2 } from "@src/pages/Additions/PriceFormat";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import axios from "axios";

export const ProductsModal = ({ products }: { products: IProduct[] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = queryString.parse(location.search);
  const productId = Number(params.id);
  const isModalOpen = params.modal === "true";

  const item = products.find((p) => p.id === productId);

  const [productCount, setProductCount] = useState<number>(1);

  const handleClose = () => {
    navigate("/home");
  };
  const userId = localStorage.getItem("userId");

  const onFinish = async (itemId: number) => {
    try {
      if (!userId) {
        console.error("User ID not found!");
        return;
      }

      // 1. Mavjud savatni tekshiramiz
      const { data: baskets } = await axios.get(
        `https://80a4e112872cbb1a.mokky.dev/basket?userId=${userId}`
      );

      const existingBasket = baskets.length > 0 ? baskets[0] : null;

      if (existingBasket) {
        // 2. Agar savat bo'lsa, mavjud `products` ga yangisini qo'shamiz
        existingBasket.products.push({
          productId: itemId,
          quantity: productCount,
        });

        // 3. Savatni yangilaymiz (`PUT` so‘rovi bilan)
        await axios.patch(
          `https://80a4e112872cbb1a.mokky.dev/basket/${existingBasket.id}`,
          existingBasket
        );
      } else {
        // 4. Agar foydalanuvchining savati bo‘lmasa, yangi savat yaratamiz
        const newBasket = {
          userId: Number(userId),
          products: [
            {
              productId: itemId,
              quantity: productCount,
            },
          ],
        };

        await axios.post(
          `https://80a4e112872cbb1a.mokky.dev/basket`,
          newBasket
        );
      }

      console.log("Product added to basket successfully!");
      message.success("Product added to basket successfully!");
    } catch (error) {
      console.error("Error adding product to basket:", error);
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    if (!item) {
      handleClose();
    }
  }, [item]);

  return (
    <Modal
      footer={null}
      open={isModalOpen && !!item}
      onCancel={handleClose}
      width={700}
      className="custom-modal md:rounded-3xl"
    >
      {item && (
        <>
          <Title level={2} className="modal-title text-center">
            {item.title}
          </Title>
          <div className="flex gap-4">
            <div className="w-full">
              <img
                src={item.image}
                alt="product image"
                style={{
                  width: "400px",
                  height: "270px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </div>
            <div
              className="w-full"
              style={{
                height: "280px",
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <Typography.Title level={5}>
                {item.description || "Описание продукта"}
              </Typography.Title>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Состав:
              </Typography.Title>
              {item.compound?.map((sostav: string, index: number) => (
                <Typography key={index} style={{ margin: 0, fontWeight: 500 }}>
                  {sostav}
                </Typography>
              ))}
              <Typography
                style={{ margin: 0, fontWeight: 500 }}
                className="text-gray-400"
              >
                {item.weight || "520г"} Г, ккал {item.calories}
              </Typography>
            </div>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="w-full">
              <Button
                type="primary"
                className="bg-[#FF7020] text-white w-full py-5 rounded-xl"
                onClick={() => onFinish(item.id)}
              >
                Добавить
              </Button>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex bg-[#F2F2F3] items-center rounded-xl h-10">
                <Button type="text" className="p-3">
                  <HiOutlineMinus
                    onClick={() =>
                      productCount > 1 && setProductCount(productCount - 1)
                    }
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  />
                </Button>
                <Typography.Title level={5} className="mt-2">
                  {productCount}
                </Typography.Title>
                <Button type="text" className="p-3">
                  <HiPlus
                    onClick={() => setProductCount(productCount + 1)}
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  />
                </Button>
              </div>
              <div>
                <Typography.Title level={2} style={{ margin: 0 }}>
                  {priceFormatter2(item.price * productCount)} ₽
                </Typography.Title>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
