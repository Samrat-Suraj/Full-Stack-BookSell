"use client"
import { useSelector } from "react-redux";
import ErrorMessage from "../components/ErrorMessage";

const TermsOfUse = () => {
    const { errorMessage } = useSelector((store: any) => store.auth)
    return (
        <>
            {
                errorMessage ? <ErrorMessage /> : <></>
            }

            <div className="max-w-4xl mt-7 mb-7 mx-auto p-6 bg-white rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms of Use</h1>
                <p className="text-gray-600">
                    Welcome to our platform. By using this website, you agree to abide by our terms and conditions.
                </p>
                <ul className="list-disc pl-5 mt-4 text-gray-600">
                    <li>Users must provide accurate book descriptions.</li>
                    <li>Transactions are between buyers and sellers.</li>
                    <li>No fraudulent or prohibited book sales.</li>
                    <li>We reserve the right to suspend accounts violating our terms.</li>
                </ul>
            </div>

        </>

    );
};

export default TermsOfUse;
