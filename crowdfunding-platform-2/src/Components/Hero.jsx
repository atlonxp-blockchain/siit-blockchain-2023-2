import React, { useState } from "react";

const Hero = ({ titleData, createCampaign }) => {
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
  });

  const createNewCampaign = async (e) => {
    e.preventDefault();
    try {
      const data = await createCampaign(campaign);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <span className="coverLine"></span>
      <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
      <img
        src="https://cdn.shopify.com/s/files/1/0070/7032/files/what-is-Crowdfunding-101_a45d51bf-615e-48ac-9ed8-2283b68db2ee.jpg?v=1627052693"
        className="absolute inset-0 object-cover w-full h-full"
        alt=""
      />
      <div className="relative bg-blue-900 bg-opacity-75">
        <svg className="absolute inset-x-0 bottom-0 text-white" viewBox="0 0 1160 163">
          <path
            fill="currentColor"
            d="M-164 13L-104 39.7C-44 66 76 120 196 141C316b162 436 152 556 119.7C676
            88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036"
          />
        </svg>
        <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-8 lg:px-20">
          <div className="flex flex-col items-center justify-between xl:flex-row">
            <div className="w-full max-w-xl mb-12 xl:mb-0 xl:w-7/12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl tracking-tight text-white sm:text-5xl sm:leading-none">
                <span style={{ fontWeight: 800 }}>Jigsaw Funding</span> <br className="hidden md:block" />
                <span style={{ fontWeight: 500, fontSize: "2rem"}}>Make people smile</span>
              </h2>
              <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
              Empower change with your support! Every contribution, big or small, amplifies the impact we can make together. Be a catalyst for positive change—donate now and be part of our journey towards a brighter future!
              </p>
            </div>
            <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
              <div className="bg-white rounded shadow-2xl p-7 sm:p-10">
                <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
                  Campaign
                </h3>
                <form>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="title"
                      className="inline-block mb-1 font-medium"
                    >
                      Title
                    </label>
                    <input
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          title: e.target.value,
                        })
                      }
                      placeholder="Title"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm
                      appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:outline"
                      id="title"
                      name="title"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="description"
                      className="inline-block mb-1 font-medium"
                    >
                      Description
                    </label>
                    <textarea
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                      required
                      className="flex-grow w-full h-24 px-4 py-2 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm
                        appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:outline"
                      id="description"
                      name="description"
                    ></textarea>
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="amount"
                      className="inline-block mb-1 font-medium"
                    >
                      Target Amount
                    </label>
                    <input
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          amount: e.target.value,
                        })
                      }
                      placeholder="Amount"
                      required
                      type="text"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm
                      appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:outline"
                      id="amount"
                      name="amount"
                    />
                  </div>
                  <div className="mb-1 sm:mb-2">
                    <label
                      htmlFor="deadline"
                      className="inline-block mb-1 font-medium"
                    >
                      Deadline
                    </label>
                    <input
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          deadline: e.target.value,
                        })
                      }
                      placeholder="Date"
                      required
                      type="date"
                      className="flex-grow w-full h-12 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm
                      appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:outline"
                      id="deadline"
                      name="deadline"
                    />
                  </div>
                  <div className="mt-4 mb-2 sm:mb-4">
                    <button
                      onClick={(e) => createNewCampaign(e)}
                      type="submit"
                      className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200
                      rounded shadow-md bg-green-500 hover:bg-green-700 focus:shadow-outline focus:outline-none newColor"
                    >
                      Create a Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
