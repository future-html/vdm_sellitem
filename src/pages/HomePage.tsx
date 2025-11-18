import { useState, useMemo, useEffect } from "react";
import mqtt from 'mqtt';

// Mock items for demonstration
const initialItems = [
    { itemName: "Coke", cost: 1.50, itemId: "1", stock: 10, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300", description: "Refreshing cola drink" },
    { itemName: "Pepsi", cost: 1.50, itemId: "2", stock: 8, image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300", description: "Classic pepsi" },
    { itemName: "Water", cost: 1.00, itemId: "3", stock: 15, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300", description: "Pure water" },
    { itemName: "Chips", cost: 2.00, itemId: "4", stock: 12, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", description: "Crispy chips" },
    { itemName: "Candy", cost: 1.25, itemId: "5", stock: 20, image: "https://images.unsplash.com/photo-1581798459219-c944e5d3e18d?w=300", description: "Sweet candy" },
    { itemName: "Gum", cost: 0.75, itemId: "6", stock: 25, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300", description: "Fresh gum" }
];

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
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [step, setStep] = useState(1);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [logSuccess, setLogSuccess] = useState("");

    const [quantities, setQuantities] = useState(
        Object.fromEntries(initialItems.map(item => [item.itemName, 0]))
    );

    const [items, setItems] = useState(
        initialItems.map(i => ({ ...i }))
    );

    // Create cart summary with item names
    const cartSummary = useMemo(() => {
        return cart.map(c => `${c.itemName} x${c.quantity}`).join(', ');
    }, [cart]);

    // MQTT Configuration
    const mqttConfig = useMemo(() => ({
        host: "wss://mqtt.netpie.io:443/mqtt",
        options: {
            clientId: import.meta.env.VITE_CLIENT_ID || "demo-client",
            username: import.meta.env.VITE_TOKEN || "demo",
            password: import.meta.env.VITE_PASSWORD || "demo",
        }
    }), []);

    // MQTT Connection with proper event handling
    useEffect(() => {
        const mqttClient = mqtt.connect(mqttConfig.host, mqttConfig.options);
        
        mqttClient.on('connect', () => {
            console.log('✅ MQTT Connected');
            setIsConnected(true);
            setClient(mqttClient);
            setLogSuccess("✅ Connected to MQTT");
        });
        
        mqttClient.on('error', (err) => {
            console.error('❌ MQTT Error:', err);
            setLogSuccess(`❌ Connection failed: ${err.message}`);
            setIsConnected(false);
        });

        mqttClient.on('offline', () => {
            console.log('⚠️ MQTT Offline');
            setIsConnected(false);
        });

        mqttClient.on('reconnect', () => {
            console.log('🔄 MQTT Reconnecting...');
            setLogSuccess("🔄 Reconnecting to MQTT...");
        });

        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
            setIsConnected(false);
        };
    }, [resetTrigger, mqttConfig.host, mqttConfig.options]);

    // Publish message function
    const publishMessage = (topic: string, msg: string) => {
        if (!client || !isConnected) {
            console.log("❌ MQTT client not ready");
            setLogSuccess("❌ Error: MQTT not connected");
            return;
        }

        client.publish(topic, msg, {}, (err) => {
            if (err) {
                console.error("Publish error:", err);
                setLogSuccess(`❌ Error: ${err.message}`);
            } else {
                console.log(`📤 Sent to ${topic}:`, msg);
                setLogSuccess(`✅ Successfully sent message to ${topic}`);
            }
        });
    };

    const onConfirmPayment = () => {
        if (paymentMethod) {
            // Send cart summary when payment is confirmed
            const message = JSON.stringify({
                items: cart,
                paymentMethod: paymentMethod,
                total: cart.reduce((sum, c) => sum + (c.cost * c.quantity), 0),
                timestamp: new Date().toISOString()
            });
            publishMessage("@msg/vending", message);
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

    const resetApp = () => {
        setStep(1);
        setCart([]);
        setItems(initialItems.map(i => ({ ...i })));
        setQuantities(
            Object.fromEntries(initialItems.map(item => [item.itemName, 0]))
        );
        setPaymentMethod("");
        setLogSuccess("");
        setResetTrigger(prev => prev + 1);
    };

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
                                            disabled={item.stock === 0 || qty >= item.stock}
                                            onClick={() => increaseQty(item)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
                                        disabled={item.stock === 0 || qty === 0}
                                        onClick={() => addToCart(item)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                        disabled={cart.length === 0}
                        onClick={() => setStep(2)}
                    >
                        Go to Cart ({cart.length} items)
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
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p className="text-lg font-bold">
                            Total: ${cart.reduce((sum, c) => sum + (c.cost * c.quantity), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setStep(1)}>
                            Back
                        </button>
                        <button 
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                            disabled={cart.length === 0}
                            onClick={() => setStep(3)}
                        >
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
                            disabled={!paymentMethod }
                            onClick={onConfirmPayment}
                        >
                            Confirm Payment
                        </button>
                    </div>
                    {!isConnected && (
                        <p className="mt-3 text-red-600 text-sm">⚠️ MQTT not connected. Please wait or refresh.</p>
                    )}
                </div>
            )}

            {/* STEP 4: Summary */}
            {step === 4 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">4. Order Summary</h2>
                    <div className="bg-green-50 border border-green-200 p-4 rounded mb-4">
                        <p className="text-green-800 font-semibold">✅ Order sent to vending machine!</p>
                        <p className="text-sm text-green-700 mt-1">Items: {cartSummary}</p>
                    </div>
                    <h3 className="font-semibold">Order Details:</h3>
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
                        onClick={resetApp}
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
                </div>
            )}
        </div>
    );
}

export default HomePage;