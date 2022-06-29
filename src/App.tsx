import React, {useState} from 'react';
import {Form} from "./components/Form";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
    const [address, setAddress] = useState<string>("");

    const chainId = process.env.CHAIN_ID as string;
    const backendAddress = process.env.BACKEND_ADDRESS as string;
    const networkName = process.env.NETWORK_NAME as string;

    const instance = axios.create({
        baseURL: backendAddress,
        timeout: 30000,
    });
    const onSendClick = async () => {
        if (address && address.trim()) {
            try {
                const response = await toast.promise(
                    instance.get("/?addr=" + address),
                    {
                        pending: 'Sending your tokens 🚀',
                    },
                    {
                        position: "top-center"
                    }
                );
                console.log(response)
                if (response.data) {
                    if (response.data.error) {
                        toast.error("Error: " + response.data.error + ' 🤯', {position: "top-center"})
                        return;
                    }

                    if (response.data.code === 0) {
                        toast.success("Success! 🤘", {position: "top-center"})
                    }

                    if (response.data.code !== 0) {
                        toast.error(JSON.stringify(response.data) + ' 🤯', {position: "top-center"})
                    }
                }
            } catch (e) {
                toast.error("Error: " + e + ' 🤯', {position: "top-center"})
            }
        } else {
            toast.error("Please enter your address! 👇", {position: "top-center"})
        }
    }

    const onFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setAddress(value)
    }

    return (
        <div className="h-screen bg-gray-900">
            <ToastContainer/>
            <div className="min-w-full h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4">
                <div className="text-white font-bold p-3">{chainId}</div>
            </div>
            <div className="max-w-screen-sm m-auto mt-32">

                <div className="text-white text-2xl font-bold p-2">
                    <p>{networkName}</p>
                </div>
                <div className="text-gray-300 p-2">
                    <p>Use this faucet page to get tokens for the <b>{chainId}</b>. Please don't abuse this service—the
                        number of available tokens is limited.</p>
                </div>
                <Form
                    onSendClick={onSendClick}
                    onChange={onFormChange}
                />
            </div>
        </div>
    );
}

export default App;
