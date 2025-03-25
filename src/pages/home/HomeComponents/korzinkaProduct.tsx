import { Button, Typography } from "antd";
import { IProduct } from "@src/pages/interface";
import { priceFormatter2 } from "@src/pages/Additions/PriceFormat";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";

export const BasketProduct = ({
  product,
  quantity,
}: {
  product: IProduct;
  quantity: number;
}) => {
  return (
    <div className="flex">
      <img
        src={product.image}
        alt="product"
        style={{ borderRadius: "10px" }}
        className="w-20 h-15 object-cover"
      />
      <div className="flex items-center justify-between ms-2 w-full">
        <div>
          <Typography.Title level={5} className="!m-0">
            {product.title}
          </Typography.Title>
          <Typography className="text-gray-500 font-semibold">
            {product.weight}г
          </Typography>
          <Typography.Title level={5} className="!m-0">
            {priceFormatter2(product.price)} ₽
          </Typography.Title>
        </div>
        <div
          className="w-20 h-8 flex items-center justify-around bg-[#F2F2F3]"
          style={{ borderRadius: "8px" }}
        >
          <Button type="text" className="p-1">
            <HiOutlineMinus
              style={{
                cursor: "pointer",
              }}
            />
          </Button>
          {quantity}
          <Button type="text" className="p-1">
            <HiPlus
              style={{
                cursor: "pointer",
              }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
