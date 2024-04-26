import UploadButton from "@/components/upload-button";

const Dashboard = () => {
  return (
    <main className='mx-auto w-full max-w-screen-xl px-2.5 md:px-20 md:p-10'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl text-gray-900'>Files</h1>

        <UploadButton subscribed={false} />
      </div>
    </main>
  );
};

export default Dashboard;
