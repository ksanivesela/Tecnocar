import ProductCard from "../common/ProductCard";

import type { Product } from "../../types/product";

interface Props{

products:Product[];

}

export default function ProductGrid({

products

}:Props){

return(

<div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">

{

products.map(product=>(

<ProductCard

key={product.id}

product={product}

/>

))

}

</div>

);

}