export default function InvitationNotFound() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="font-serif-display text-4xl font-light tracking-[0.16em] text-[#1B3424]">
          K <span className="italic text-[#7C9668]">&amp;</span> Đ
        </p>
        <div className="my-6 h-[1px] w-12 bg-[rgba(27,52,36,0.2)] mx-auto" />
        <p className="text-xs uppercase tracking-[0.26em] text-[#3D2B24]">
          Đường dẫn không tồn tại
        </p>
        <p className="mt-3 text-sm text-[#696D66] font-light leading-relaxed">
          Liên kết thiệp mời này không hợp lệ hoặc đã được thu hồi.
        </p>
      </div>
    </main>
  );
}
