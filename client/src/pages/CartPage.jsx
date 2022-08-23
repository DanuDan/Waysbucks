import React, { useState } from "react";
import Rupiah from "rupiah-format";
import { useEffect } from "react";
import Style from "../css/cart.module.css";
import trash from "../assets/trash.svg";
import ModalCart from "../components/modal/Cart";
import Navbar from "../components/navbar/navbar";
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [showTrans, setShowTrans] = useState(false);
  const handleClose = () => setShowTrans(false);
  let navigate = useNavigate();

  //CART
  let { data: cart, refetch } = useQuery("cartsCache", async () => {
    const response = await API.get("/carts-id");
    return response.data.data;
  });

  //TOTAL
  let resultTotal = cart?.reduce((a, b) => {
    return a + b.subtotal;
  }, 0);

 //DELETE

  let handleDelete = async (id) => {
    console.log(id);
    await API.delete(`/cart/` + id);
    refetch();
  };

  //PAY
  const form = {
    status: "success",
    total: resultTotal,
  };
  const handleSubmit = useMutation(async (e) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    // Insert transaction data
    const body = JSON.stringify(form);

    const response = await API.patch("/transaction", body, config);
    console.log(response);

    const token = response.data.data.token;
    console.log(token);

    window.snap.pay(token, {
      onSuccess: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        navigate("/profile");
      },
      onPending: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        navigate("/profile");
      },
      onError: function (result) {
        /* You may add your own implementation here */
        console.log(result);
      },
      onClose: function () {
        /* You may add your own implementation here */
        alert("you closed the popup without finishing the payment");
      },
    });
  });

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "Client key here ...";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className={Style.container}>
        <section>
          <p className={Style.titlePage}>My Cart</p>
          <p className={Style.subtitlePage}>Review Your Order</p>
          <div className={Style.wrap}>
            <div className={Style.wrap}>
              <div className={Style.left}>
                {cart?.map((item, index) => (
                  <div className={Style.warpProduct} key={index}>
                    <img
                      src={item?.product?.image}
                      className={Style.imgProduct}
                      alt="cartimage"
                    />
                    <div className={Style.con_wrap}>
                      <span className={Style.tex_left}>
                        <p>{item.product.title}</p>
                        <p>{Rupiah.convert(item?.subtotal)}</p>
                      </span>
                      <span className={Style.tex_left1}>
                        <p>
                          Toping :{" "}
                          <span>
                            {" "}
                            {item.topping?.map((topping, idx) => (
                              <span className="d-inline" key={idx}>
                                {topping.title},
                              </span>
                            ))}
                          </span>
                        </p>
                        <img
                          src={trash}
                          onClick={() => handleDelete(item.id)}
                          alt="#"
                        />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={Style.right}>
                <div className={Style.rightline}>
                  <span>
                    <p>Subtotal</p>
                    <p>{Rupiah.convert(resultTotal)}</p>
                  </span>
                  <span>
                    <p>Qty</p>
                    <p>{cart?.length}</p>
                  </span>
                </div>
                <span className={Style.price}>
                  <p>Total</p>
                  <p>{Rupiah.convert(resultTotal)}</p>
                </span>
                <div className={Style.btn_grp}>
                  <button type="submit" onClick={(e) => handleSubmit.mutate(e)}>
                    Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ModalCart showTrans={showTrans} close={handleClose} />
        </section>
      </div>
    </>
  );
}
