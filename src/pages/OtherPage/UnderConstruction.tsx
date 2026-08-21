import PageMeta from "../../components/common/PageMeta";
import { SHOP_NAME } from "../../common/constants";

export default function UnderConstruction() {
  return (
      <>
        <PageMeta
            title={`Under Construction | ${SHOP_NAME}`}
            description={`${SHOP_NAME} website is currently under construction`}
        />

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffef5] px-6 py-10">

          {/* Soft background glow */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-yellow-200/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-100/40 blur-3xl" />

          {/* Main Card */}
          <div className="relative z-10 w-full max-w-3xl">

            <div className="overflow-hidden rounded-2xl border border-yellow-400 bg-white shadow-[0_15px_40px_rgba(180,140,20,0.12)]">

              {/* Header - matches shop branding */}
             {/* <div className="bg-gradient-to-r from-[#FFD400] via-[#FFE66D] to-[#F2B900] px-6 py-7 text-center sm:px-10">

                <h1 className="text-2xl font-bold tracking-tight text-[#07152d] sm:text-3xl">
                  Sri Jayalakshmi
                </h1>

                <h2 className="text-2xl font-bold tracking-tight text-[#07152d] sm:text-3xl">
                  Jewellers
                </h2>

                <p className="mt-1 text-sm font-medium text-[#07152d]">
                  Gold • Silver
                </p>
              </div>*/}

              {/* Content */}
              <div className="px-6 py-12 text-center sm:px-12 sm:py-16">

                {/* Jewellery icon */}
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-[0_8px_25px_rgba(234,179,8,0.18)]">

                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      fill="none"
                      className="h-12 w-12"
                  >
                    {/* Diamond */}
                    <path
                        d="M12 24L20 12H44L52 24L32 52L12 24Z"
                        stroke="#A16207"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M12 24H52"
                        stroke="#A16207"
                        strokeWidth="3"
                    />

                    <path
                        d="M20 12L32 24L44 12"
                        stroke="#A16207"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M20 12L12 24L32 52L52 24L44 12"
                        stroke="#EAB308"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M32 24L32 52"
                        stroke="#EAB308"
                        strokeWidth="2"
                    />
                  </svg>

                </div>

                {/* Small heading */}
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#A16207]">
                  Coming Soon
                </p>

                {/* Main heading */}
                <h2 className="text-3xl font-bold text-[#07152d] sm:text-4xl">
                  Webpage Under Construction
                </h2>

                {/* Gold divider */}
                <div className="mx-auto mt-5 flex items-center justify-center gap-3">
                  <span className="h-px w-16 bg-yellow-300" />
                  <span className="text-lg text-yellow-500">✦</span>
                  <span className="h-px w-16 bg-yellow-300" />
                </div>

                {/* Description */}
                <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-600">
                  We are currently working on something beautiful for you.
                  Webpage is being updated to provide you with a better
                  jewellery management experience.
                </p>

                <p className="mt-3 text-sm font-medium text-gray-500">
                  Please check back shortly.
                </p>

              </div>



            </div>
          </div>
        </div>
      </>
  );
}