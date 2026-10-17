# Project Skills — Quy tắc bắt buộc

Tài liệu này quy định cách AI phân tích, thiết kế, viết, chỉnh sửa, tối ưu và nâng cấp website trong dự án. Tất cả quy tắc dưới đây là bắt buộc. Trước mỗi nhiệm vụ lập trình mới, hãy đọc lại tài liệu này và áp dụng.

## RULE 01 — DANH SÁCH, TÌM KIẾM, LỌC, SẮP XẾP VÀ PHÂN TRANG

Đối với giao diện có danh sách dữ liệu, hãy triển khai đầy đủ các chức năng phù hợp với dữ liệu và nhu cầu thực tế:

- Tìm kiếm theo trường `title`; tìm kiếm không phân biệt chữ hoa/chữ thường và ưu tiên hỗ trợ tiếng Việt có dấu/không dấu.
- Lọc theo các thuộc tính thực sự có trong dữ liệu. Không tự tạo thuộc tính hoặc bộ lọc không có cơ sở trong dữ liệu.
- Sắp xếp theo `title` tăng dần (A–Z) và giảm dần (Z–A).
- Phân trang với lựa chọn 10, 20, 50 và All (hiển thị tất cả); có nút trang trước/sau và thông tin trang hiện tại/tổng số trang khi phù hợp.
- Xử lý dữ liệu theo thứ tự: tìm kiếm → lọc → sắp xếp → phân trang.
- Khi điều kiện tìm kiếm, lọc hoặc số lượng hiển thị thay đổi, kiểm tra và điều chỉnh trang hiện tại để trang hợp lệ.
- Hiển thị tổng số kết quả và thông báo rõ ràng khi danh sách trống.
- Bảo đảm các chức năng hoạt động thực tế bằng JavaScript, không chỉ dựng giao diện tĩnh.
- Không hiển thị các thành phần phân trang không cần thiết khi danh sách không có dữ liệu.

Chỉ áp dụng các chức năng phù hợp với loại danh sách và dữ liệu hiện có; không làm sai lệch hành vi hoặc nội dung của website để ép một danh sách vào mẫu chung.

## RULE 02 — CHỈ SỬ DỤNG HTML5, CSS3 VÀ JAVASCRIPT THUẦN

- Chỉ sử dụng HTML5, CSS3 và Vanilla JavaScript. Không sử dụng React, Vue, Angular, Next.js, TypeScript hoặc framework frontend khác.
- Không dùng thư viện UI để thay thế việc viết HTML, CSS và JavaScript thuần.
- Ưu tiên semantic HTML, accessibility, responsive design và JavaScript ES6+.
- Mọi tính năng phải tương thích với cấu trúc website tĩnh hiện có.
- Chỉ sử dụng API hoặc dịch vụ bên ngoài khi người dùng đồng ý và việc đó không thay đổi công nghệ cốt lõi.
- Trước khi đề xuất thêm dependency hoặc thay đổi công nghệ, giải thích lý do, tác động và xin xác nhận.

## RULE 03 — GLASSMORPHISM DESIGN SYSTEM

Mọi giao diện mới và phần giao diện được cho phép chỉnh sửa phải theo phong cách Glassmorphism:

- Dùng nền kính mờ, độ trong suốt và `backdrop-filter: blur()` khi phù hợp.
- Tạo chiều sâu bằng viền sáng mảnh và bóng đổ mềm, nhiều lớp.
- Dùng màu sắc hài hòa, hiện đại, chuyên nghiệp; bo góc nhất quán.
- Có trạng thái hover, focus và active rõ ràng, cùng animation/transition mượt và có chủ đích.
- Đảm bảo responsive trên desktop, tablet và mobile; duy trì độ tương phản, khả năng đọc và hiệu suất.
- Có giao diện dự phòng dễ đọc cho trình duyệt không hỗ trợ `backdrop-filter`.
- Không tự ý thay đổi toàn bộ giao diện hiện có nếu chưa được người dùng chấp thuận.

## RULE 04 — BẮT BUỘC HỎI TRƯỚC KHI THAY ĐỔI

Đọc file, kiểm tra dự án và lập kế hoạch không cần xin phép. Trước mọi thao tác ghi hoặc thay đổi mã nguồn, giao diện, cấu trúc thư mục hay cấu hình, phải:

- Giải thích nội dung dự định thay đổi và nêu rõ từng file sẽ được tạo, sửa hoặc xóa.
- Giải thích lợi ích và ảnh hưởng dự kiến đến chức năng hiện có.
- Nếu có nhiều phương án hợp lý, trình bày các phương án, đề xuất phương án phù hợp nhất và giải thích lý do.
- Chờ người dùng xác nhận rõ ràng trước khi thực hiện.
- Không tự ý xóa code, đổi tên file, đổi cấu trúc thư mục hoặc ghi đè dữ liệu.
- Nếu phát hiện lỗi ngoài phạm vi yêu cầu, báo cáo và xin phép trước khi sửa.

Nếu yêu cầu mới xung đột với quy tắc này hoặc với quy tắc khác trong tài liệu, hãy giải thích xung đột và hỏi người dùng trước khi tiến hành thay đổi.

## RULE 05 — LUÔN LẬP KẾ HOẠCH TRƯỚC KHI CODE

Trước mỗi nhiệm vụ lập trình, thực hiện đầy đủ quy trình sau, kể cả với thay đổi nhỏ:

1. Phân tích yêu cầu và xác định phạm vi.
2. Kiểm tra cấu trúc dự án cùng các file liên quan.
3. Xác định chức năng cần tạo hoặc chỉnh sửa.
4. Lập kế hoạch chi tiết theo từng bước.
5. Liệt kê file dự kiến tác động và nêu rõ file tạo mới, chỉnh sửa hoặc xóa.
6. Trình bày các phương án phù hợp, đề xuất phương án tối ưu và yêu cầu người dùng xác nhận.
7. Chỉ triển khai sau khi nhận được xác nhận rõ ràng.
8. Kiểm tra thay đổi và báo cáo kết quả, lỗi còn tồn tại và các phần chưa kiểm chứng.

Không bắt đầu triển khai khi chưa hoàn thành bước xác nhận. Không mở rộng phạm vi sang nâng cấp toàn bộ website nếu người dùng không yêu cầu.

## RULE 06 — CẤU TRÚC DỰ ÁN KHOA HỌC

Ưu tiên cách tổ chức sau khi tạo cấu trúc mới và khi phù hợp với dự án:

```text
project-root/
├── index.html
├── pages/
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
├── video/
├── assets/
└── .skill/
    └── skill.md
```

- HTML đặt tại thư mục gốc hoặc `pages/` theo chức năng.
- CSS đặt trong `css/`; JavaScript đặt trong `js/`.
- Hình ảnh đặt trong `images/`; video trong `video/`; tài nguyên khác trong `assets/` khi cần.
- Chỉ tạo thư mục khi dự án thực sự cần.
- Kiểm tra cấu trúc dự án hiện có trước khi đề xuất tái cấu trúc.
- Không tự ý di chuyển file hoặc đổi đường dẫn khi chưa được phép.
- Khi được cho phép thay đổi đường dẫn, kiểm tra và cập nhật các liên kết liên quan để chúng tiếp tục hoạt động.

## RULE 07 — CSS VÀ JAVASCRIPT PHẢI LÀ FILE EXTERNAL

- Không viết CSS trực tiếp trong thẻ `<style>` của HTML.
- Không viết JavaScript trực tiếp trong thẻ `<script>` của HTML.
- Không dùng inline style hoặc inline event handler như `onclick`.
- Liên kết CSS bằng thẻ `<link>` tới file `.css` bên ngoài.
- Liên kết JavaScript bằng thẻ `<script src="...">` tới file `.js` bên ngoài.
- Dùng `addEventListener` để xử lý sự kiện.
- Có thể chia CSS và JavaScript thành nhiều file theo module/chức năng khi thực sự cần; tránh lặp code và giữ mã dễ bảo trì.

## Cách áp dụng tài liệu

- Trước mỗi nhiệm vụ lập trình mới, đọc lại `.skill/skill.md`, kiểm tra các quy tắc liên quan và áp dụng chúng trong suốt quá trình làm việc.
- Nếu môi trường AI hoặc extension hỗ trợ project instructions/rules để tự động nạp tài liệu này, hãy đề xuất cách tích hợp trước. Không tạo hoặc sửa file cấu hình tích hợp nếu chưa được người dùng chấp thuận.
- Nếu môi trường không tự động đọc được tài liệu này, nói rõ giới hạn đó và đề xuất cách tích hợp phù hợp; không tuyên bố rằng tài liệu được tự động áp dụng khi chưa xác minh.
- Khi báo cáo kết quả, nêu các kiểm tra đã thực hiện và mọi giới hạn xác minh còn lại.
