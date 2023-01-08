import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";

interface ProductProps {
    product: {
        id: string;
        name: string;
        imageUrl: string;
        price: string;
        description: string;
        defaultPriceId: string;
    }
}

export default function Product({ product } : ProductProps) {

    const { isFallback } = useRouter()

    const [isRedirectCheckout, setIsRedirectCheckout] = useState(false)


    async function handleBuyProduct() {
        try {
            setIsRedirectCheckout(true)

            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId
            })

            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl
        } catch (err) {
            // Conectar a uma ferramenta de observabilidade (Datadog / Sentury)
            setIsRedirectCheckout(false);
            toast.error('Falha ao ir para página de pagamento')
        }
    }

    if(isFallback) {
        return <p>Loading...</p>
    }
    
    return (
        <>
        <Head>
            <title>{product.name} | Shop</title>
        </Head>
        <ProductContainer>
            <ImageContainer>
                <Image src={product.imageUrl} width={520} height={480} alt="" />
            </ImageContainer>

            <ProductDetails>
                <h1>{product.name}</h1>
                <span>{product.price}</span>

                <p>{product.description}</p>
            
                <button disabled={isRedirectCheckout} onClick={handleBuyProduct}>
                    Comprar agora
                </button>
            </ProductDetails>
        </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id : 'prod_N7zS7VvYRNwcrg' } }
        ],
        fallback: true
    }
} 

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {

    const productId = params!.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    })

    const price = product.default_price as Stripe.Price


    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format((price.unit_amount!/100)),
                description: product.description,
                defaultPriceId: price.id
            }
        },
        revalidate: 60 * 60 * 1 // 1 hours
    }
}