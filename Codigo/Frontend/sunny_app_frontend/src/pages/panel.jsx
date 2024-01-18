import { React, useState } from "react";
import { useEffect } from "react";
import { NavBar } from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Chart } from "../components/chart";

export function Panel() {
  const [data_table, useDataTable] = useState([]);
  const [users, useUsers] = useState([]);
  const navigate = useNavigate();

  async function generateData() {

    event.preventDefault();

    try {
        const response = await fetch("http://127.0.0.1:8000/data_table/create_data/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 201) {
            alert("Data Generated. Please Reload The Page")
        } else {
            alert("Something Wrong")
        }
    } catch (error) {
        console.error("Error Generating Data:", error);
    }
}

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data_table/")
      .then((response) => response.json())
      .then((data) => useDataTable(data));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/user-info/")
      .then((response) => response.json())
      .then((data) => useUsers(data));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("user_token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <header>
        <NavBar
          to1={"/"}
          title1={"Logout"}
          action={() => localStorage.removeItem("user_token")}
          to2={"/posts/create"}
          title2={"CreatePost"}
          to3={"/user"}
          title3={
            localStorage.getItem("user_token")
              ? jwtDecode(localStorage.getItem("user_token")).username
              : ""
          }
        />
      </header>

      <main className="font-source-code-pro flex justify-center h-screen">
        <section className="flex flex-col mt-6">
          <div className="flex">
            <button onClick={generateData} className="bg-orange-600 rounded-md h-9 w-24 font-semibold hover:text-yellow-500 duration-300">Generate</button>
            <table className="w-64 bg-yellow-500 rounded-xl overflow-hidden mx-auto ml-4">
              <thead>
                <tr className="bg-orange-600 rounded-xl">
                  <th className="py-2 px-4 border-b rounded-tl-xl">Date</th>
                  <th className="py-2 px-4 border-b rounded-tr-xl">Value</th>
                </tr>
              </thead>
              <tbody>
                {[...data_table].map(function (data_table) {
                  return (
                    <tr key={data_table.Date} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b rounded-bl-xl text-center">
                        {data_table.Date}
                      </td>
                      <td className="py-2 px-4 border-b rounded-br-xl text-center">
                        {data_table.Value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="bg-yellow-200 w-96 h-max ml-44 mt-6 rounded-lg">
          <Chart data_table={data_table} />
        </section>
      </main>
    </>
  );
}