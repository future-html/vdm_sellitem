import { useState } from "react";
import { itemsCategories as initialItems } from "../lib/constant";
// import { storage } from "../utils/localStorage";
interface Item {
    itemName: string;
    cost: number;
    itemId: string;
    stock: number;
    image: string;
    description: string;
}

interface CartItem {
    itemName: string;
    cost: number;
    quantity: number;
    itemId: string;
}

function HomePage() {
    // stock quantity is not equal to user selected
    const [step, setStep] = useState(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("");


    const [quantities, setQuantities] = useState(
        Object.fromEntries(initialItems.map(item => [item.itemName, 0]))
    );

    const [items, setItems] = useState(
        initialItems.map(i => ({ ...i })) // deep clone
    );

    const [logSuccess, setLogSuccess] = useState("");



    const onConfirmPayment = () => {
        if (paymentMethod) setStep(4);
    };

    // const auth = storage.get('user') as { name?: string } | null;
    // const username = useMemo(() => {
    //     return auth?.name || "Guest";
    // }, [auth])
    // const email = "";



    const increaseQty = (item: Item): void => {
        if (item.stock > quantities[item.itemName]) {
            setQuantities(prev => ({
                ...prev,
                [item.itemName]: prev[item.itemName] + 1
            }));
        }
    };

    const decreaseQty = (item:Item): void => {
        if (quantities[item.itemName] > 0) {
            setQuantities(prev => ({
                ...prev,
                [item.itemName]: prev[item.itemName] - 1
            }));
        }
    };

    const addToCart = (item:Item): void => {
        const updatedCart = [...cart];

        console.log('add cart')

        const filteredExistCart = updatedCart.findIndex((cart) => cart.itemId === item.itemId);
        if (filteredExistCart === -1) {
            updatedCart.push({ itemName: item.itemName, cost: item.cost, quantity: quantities[item.itemName], itemId: item.itemId });
        }
        else {
            updatedCart[filteredExistCart].quantity = quantities[item.itemName];
        }
        console.log(updatedCart, 'update cart')
        const filteredCart = updatedCart.filter((cart) => cart.quantity !== 0)
        setCart(filteredCart)
    };

    // console.log(cart, 'cart');

    // console.log(import.meta.env)

    console.log(logSuccess, 'logSuccess')


    return (
        <div className="p-6 max-w-4xl mx-auto">

            {/* --------------------------- */}
            {/* STEP 1: Choose Items */}
            {/* --------------------------- */}
            {step === 1 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">1. Choose Items</h2>

                    <div className="grid grid-cols-3 gap-4">
                        {items.map((item) => {
                            const qty = quantities[item.itemName];

                            return (
                                <div
                                    key={item.itemName}
                                    className={`border p-4 rounded ${item.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"
                                        }`}
                                >
                                    <img src={item.image} className="w-full h-32 object-cover rounded" />
                                    <h3 className="font-semibold mt-2">{item.itemName}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <p className="font-bold mt-1">${item.cost.toFixed(2)}</p>
                                    <p className="text-sm mt-1">Stock: {item.stock}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <button
                                            className="bg-gray-300 px-2 py-1 rounded disabled:opacity-40"
                                            disabled={qty === 0}
                                            onClick={() => decreaseQty(item)}
                                        >
                                            -
                                        </button>

                                        <span className="font-semibold">{qty}</span>

                                        <button
                                            className="bg-gray-300 px-2 py-1 rounded disabled:opacity-40"
                                            disabled={item.stock === 0}
                                            onClick={() => increaseQty(item)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
                                        disabled={item.stock === 0}
                                        onClick={() => addToCart(item)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            );
                        })}

                    </div>

                    <button
                        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => setStep(2)}
                    >
                        Go to Cart
                    </button>
                </div>
            )}

            {/* --------------------------- */}
            {/* STEP 2: View Cart */}
            {/* --------------------------- */}
            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">2. Your Cart</h2>

                    {cart.length === 0 ? (
                        <p>No items selected.</p>
                    ) : (
                        <ul className="space-y-2">
                            {cart.map((item, index) => (
                                <li key={index} className="border p-3 rounded">
                                    {item.itemName} – ${item.cost.toFixed(2)} - Qty: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-5 flex gap-3">
                        <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => setStep(1)}
                        >
                            Back
                        </button>

                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => setStep(3)}
                        >
                            Choose Payment
                        </button>
                    </div>
                </div>
            )}

            {/* --------------------------- */}
            {/* STEP 3: Payment Options */}
            {/* --------------------------- */}
            {step === 3 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">3. Payment Options</h2>

                    <div className="space-y-3">
                        {["Credit Card", "Cash on Delivery", "Bank Transfer"].map((method) => (
                            <label key={method} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                {method}
                            </label>
                        ))}
                    </div>

                    <div className="mt-5 flex gap-3">
                        <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => setStep(2)}
                        >
                            Back
                        </button>

                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={onConfirmPayment}
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            )}

            {/* --------------------------- */}
            {/* STEP 4: Summary */}
            {/* --------------------------- */}
            {step === 4 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">4. Summary</h2>

                    <h3 className="font-semibold">Items:</h3>
                    <ul className="mb-4">
                        {cart.map((item, i) => (
                            <li key={i}>{item.itemName} – ${item.cost.toFixed(2)}</li>
                        ))}
                    </ul>

                    <p>
                        <strong>Payment Method:</strong> {paymentMethod}
                    </p>

                    <p className="mt-4 text-lg font-bold">
                        Total: {cart.map((c) => c.cost * c.quantity).reduce((a, b) => a + b, 0).toFixed(2)}
                    </p>

                    <button
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={async () => {
                            setStep(1);
                            setCart([]);

                            // reset stock
                            setItems(initialItems.map(i => ({ ...i })));

                            // reset quantities
                            setQuantities(
                                Object.fromEntries(initialItems.map(item => [item.itemName, 0]))
                            );

                            // reset payment
                            setPaymentMethod("");
                            const result = await fetch('https://api.netpie.io/v2/device/shadow/data', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": `Device ${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_TOKEN}`
                                },
                                body: JSON.stringify({ "data": { number: cart.map((c)=> c.itemName).join(' ')} })
                            }).then(res => res.json()).catch(err => console.error(err));
                            console.log(result)
                            setLogSuccess(result)

                            setTimeout(() => {
                                fetch('https://api.netpie.io/v2/device/shadow/data', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": `Device ${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_TOKEN}`
                                },
                                body: JSON.stringify({ "data": { number:"" }})})
                            }, 3000); 


                        }}
                    >
                        Start Over
                    </button>
                </div>
            )}

            {logSuccess && (<div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
                <h3 className="font-semibold">Log Success:</h3>
                <pre className="whitespace-pre-wrap">{JSON.stringify(logSuccess, null, 2)}</pre>
            </div>
            )}
        </div>
    );
}

export default HomePage;