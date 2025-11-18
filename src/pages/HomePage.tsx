import { useState, useMemo, useEffect} from "react";
import { itemsCategories as initialItems } from "../lib/constant";
// Mock data for demonstration
import mqtt from 'mqtt'

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
    const [client, _] = useState<mqtt.MqttClient | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [step, setStep] = useState(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("");
   //  const [receivedMessages, setReceivedMessages] = useState([]);

    const [quantities, setQuantities] = useState(
        Object.fromEntries(initialItems.map(item => [item.itemName, 0]))
    );

    const [items, setItems] = useState(
        initialItems.map(i => ({ ...i }))
    );

    const [logSuccess, setLogSuccess] = useState("");

    // Create cart summary with full details
    const cartSummary = useMemo(() => {
        return JSON.stringify(cart.map(c => c.itemName).join(' '));
    }, [cart, paymentMethod]);

    // Publish message function
    const publishMessage = (topic:string, msg:string) => {
        if (!client || !isConnected) {
            console.log("❌ MQTT client not ready");
            setLogSuccess("Error: MQTT not connected");
            return;
        }

        client.publish(topic, msg, {}, (err) => {
            if (err) {
                console.error("Publish error:", err);
                setLogSuccess(`Error: ${err.message}`);
            } else {
                console.log(`📤 Sent to ${topic}:`, msg);
                setLogSuccess(`Successfully sent message to ${topic}`);
            }
        });
    };

    const onConfirmPayment = () => {
        if (paymentMethod) {
            // Send cart summary when payment is confirmed
            publishMessage("@msg/vending", cartSummary);
            setStep(4);
        }
    };

    const increaseQty = (item: Item) => {
        if (item.stock > quantities[item.itemName]) {
            setQuantities(prev => ({
                ...prev,
                [item.itemName]: prev[item.itemName] + 1
            }));
        }
    };

    const decreaseQty = (item: Item) => {
        if (quantities[item.itemName] > 0) {
            setQuantities(prev => ({
                ...prev,
                [item.itemName]: prev[item.itemName] - 1
            }));
        }
    };

    const addToCart = (item: Item) => {
        const updatedCart = [...cart];
        const filteredExistCart = updatedCart.findIndex((c) => c.itemId === item.itemId);
        
        if (filteredExistCart === -1) {
            updatedCart.push({ 
                itemName: item.itemName, 
                cost: item.cost, 
                quantity: quantities[item.itemName], 
                itemId: item.itemId 
            });
        } else {
            updatedCart[filteredExistCart].quantity = quantities[item.itemName];
        }
        
        const filteredCart = updatedCart.filter((c) => c.quantity !== 0);
        setCart(filteredCart);
    };

    // MQTT Connection (simulated for demo)
    useEffect(() => {
        // Simulate MQTT connection
        // interface MockMqttClient {
        //     connected: boolean;
        //     publish: (topic: string, message: string, options: Record<string, unknown>, callback: (err: Error | null) => void) => void;
        //     subscribe: (topic: string, callback: (err: Error | null) => void) => void;
        //     on: (event: string, handler: (data: unknown) => void) => void;
        //     end: () => void;
        // }

        // const mockClient: MockMqttClient = {
        //     connected: true,
        //     publish: (topic, message, _, callback) => {
        //     setTimeout(() => {
        //         console.log(`Published to ${topic}:`, message);
        //         callback(null);
        //     }, 100);
        //     },
        //     subscribe: (_, callback) => {
        //     setTimeout(() => callback(null), 100);
        //     },
        //     on: () => {},
        //     end: () => {}
        // };

        // setClient(mockClient);
        setIsConnected(true);
        setLogSuccess("✅ Connected to MQTT (Demo Mode)");

        return () => {
            setIsConnected(false);
        };
    }, [resetTrigger]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Connection Status */}
            <div className={`mb-4 p-3 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>MQTT Status:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </div>

            {/* STEP 1: Choose Items */}
            {step === 1 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">1. Choose Items</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {items.map((item) => {
                            const qty = quantities[item.itemName];
                            return (
                                <div
                                    key={item.itemName}
                                    className={`border p-4 rounded ${item.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}`}
                                >
                                    <img src={item.image} alt={item.itemName} className="w-full h-32 object-cover rounded" />
                                    <h3 className="font-semibold mt-2">{item.itemName}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <p className="font-bold mt-1">${item.cost.toFixed(2)}</p>
                                    <p className="text-sm mt-1">Stock: {item.stock}</p>

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

            {/* STEP 2: View Cart */}
            {step === 2 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">2. Your Cart</h2>
                    {cart.length === 0 ? (
                        <p>No items selected.</p>
                    ) : (
                        <ul className="space-y-2">
                            {cart.map((item, index) => (
                                <li key={index} className="border p-3 rounded">
                                    {item.itemName} – ${item.cost.toFixed(2)} × {item.quantity} = ${(item.cost * item.quantity).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-5 flex gap-3">
                        <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setStep(1)}>
                            Back
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep(3)}>
                            Choose Payment
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: Payment Options */}
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
                                    checked={paymentMethod === method}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                {method}
                            </label>
                        ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setStep(2)}>
                            Back
                        </button>
                        <button 
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                            disabled={!paymentMethod}
                            onClick={onConfirmPayment}
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: Summary */}
            {step === 4 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">4. Order Summary</h2>
                    <div className="bg-green-50 border border-green-200 p-4 rounded mb-4">
                        <p className="text-green-800 font-semibold">✅ Order sent to vending machine!</p>
                    </div>
                    <h3 className="font-semibold">Items:</h3>
                    <ul className="mb-4">
                        {cart.map((item, i) => (
                            <li key={i} className="py-1">
                                {item.itemName} – ${item.cost.toFixed(2)} × {item.quantity} = ${(item.cost * item.quantity).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Payment Method:</strong> {paymentMethod}</p>
                    <p className="mt-4 text-lg font-bold">
                        Total: ${cart.reduce((sum, c) => sum + (c.cost * c.quantity), 0).toFixed(2)}
                    </p>
                    <button
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setStep(1);
                            setCart([]);
                            setItems(initialItems.map(i => ({ ...i })));
                            setResetTrigger(prev => prev + 1);
                            setQuantities(
                                Object.fromEntries(initialItems.map(item => [item.itemName, 0]))
                            );
                            setPaymentMethod("");
                            setLogSuccess("");
                        }}
                    >
                        Start Over
                    </button>
                </div>
            )}

            {/* Log Display */}
            {logSuccess && (
                <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
                    <h3 className="font-semibold">System Log:</h3>
                    <p className="mt-2">{logSuccess}</p>
                    {step === 4 && (
                        <div className="mt-3 p-3 bg-white rounded">
                            <p className="font-semibold text-sm mb-2">Sent Message:</p>
                            <pre className="text-xs overflow-auto">{JSON.stringify(JSON.parse(cartSummary), null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomePage;