import { useEffect, useState } from "react";

const useProduct = (url) => {
  const [productData, setProductData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { mode: "cors" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        const { products } = data;
        const cleanProducts = products.map((product) => {
          return {
            // id, title, image, price, description, category, discount
            id: product.id,
            image: product.image,
            title: product.title,
            desc: product.description,
            price: product.price,
            category: product.category,
            discount: product.discount,
          };
        });

        setProductData(cleanProducts);
        // console.log(cleanProducts);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch request was canceled");
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // clean-up function
    return () => {
      controller.abort();
    };
  }, [url]);

  return { productData, error, loading };
};

export default useProduct;
