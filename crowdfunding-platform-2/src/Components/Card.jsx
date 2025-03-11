import React, { useEffect }  from "react";

const Card = ({allcampaign, setOpenModel, setDonate, title, showPopUp }) => {
  console.log(allcampaign);
  const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays.toFixed(0);
  };
  
  const handleCardClick = (campaign) => {
    // If showPopUp is true, open the popup
    if (showPopUp) {
      setDonate(campaign);
      setOpenModel(true);
    }
  };

  useEffect(() => {
    if (allcampaign && allcampaign.length > 0) {
      allcampaign.forEach((campaign) => {
        const imageKey = `campaign_image_${campaign.title}`;
        if (!localStorage.getItem(imageKey)) {
          fetch(
            `https://source.unsplash.com/featured/?crowdfunding,${campaign.title}`
          )
            .then((response) => {
              localStorage.setItem(imageKey, response.url);
            })
            .catch((error) => console.error(error));
        }
      });
    }
  }, [allcampaign]);
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 md:px-24 lg:px-8 lg:py-20">
      <p className="py-16 text-3xl font-bold">{title}</p>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allcampaign?.map((campaign, index) => {
          const imageKey = `campaign_image_${campaign.title}`;
          const imageUrl = localStorage.getItem(imageKey) || '';

          return (
            <div
              key={index + 1}
              onClick={() => handleCardClick(campaign)}
              className="border rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105 cursor-pointer"
            >
              <img
                src={imageUrl}
                className="object-cover w-full h-64 rounded-t-lg"
                alt=""
              />
              <div className="p-6">
                <p className="mb-2 text-sm font-semibold text-gray-600 uppercase">
                  Days Left: {daysLeft(campaign.deadline)}
                </p>
                <a
                  href="/"
                  aria-label="Article"
                  className="block mb-3 text-black transition-colors duration-200 hover:text-deep-purple-accent-700"
                >
                  <p className="text-xl font-bold leading-6">{campaign.title}</p>
                </a>
                <p className="mb-4 text-gray-700">{campaign.description}</p>
                <div className="flex justify-between text-gray-800">
                  <p className="font-semibold">Target: {campaign.target} ETH</p>
                  <p className="font-semibold">
                    Raised: {campaign.amountCollected} ETH
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
