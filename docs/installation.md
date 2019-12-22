# Hướng dẫn cài đặt và chạy ứng dụng

## Yêu cầu:

- `Node.js` (10.x)
- `yarn` (1.x) hoặc `npm` (6.x)

## Cài đặt dependencies

```bash
# nếu dùng yarn
yarn

# nếu dùng npm
npm i
```

## Cài đặt hệ quản trị cơ sở dữ liệu

- [Elassandra](http://doc.elassandra.io/en/latest/installation.html) (Cassandra + Elasticsearch)
- Nếu sử dụng Windows hoặc Mac, máy phải có RAM tối thiểu là 8GB để cài đặt Docker. Khi đó, cài đặt Elassandra thông qua lệnh
```bash
# nếu dùng yarn
yarn compose

# nếu dùng npm
npm run compose
```

## Tạo lược đồ dữ liệu

**Chú ý: Cassandra sẽ mất vài phút để khởi động**

- Chuyển các file [lms.cql](./lms.cql), [lms.user.csv](../data/lms.user.csv), [lms.topic.csv](../data/lms.topic.csv), [lms.course.csv](../data/lms.course.csv) vào container bằng các lệnh:
```bash
docker cp docs/lms.cql elassandra:~/lms.cql

docker cp data/lms.user.csv elassandra:~/lms.user.csv

docker cp data/lms.topic.csv elassandra:~/lms.topic.csv

docker cp data/lms.user.csv elassandra:~/lms.course.csv
```

- Truy cập vào container
```bash
docker exec -it elassandra bash
```
- Di chuyển đến home và kết nối đến Cassandra:
```bash
cd ~
cqlsh
```

- Lần lượt chạy các lệnh trong file [lms.cql](./lms.cql) để tạo các bảng:
```bash
# in cqlsh
source lms.cql
```

- import dữ liệu:
```bash
# in cqlsh
COPY lms.user FROM 'lms.user.csv';
COPY lms.topic FROM 'lms.topic.csv';
COPY lms.course FROM 'lms.course.csv';
```

- Tạo các index bằng những API trong file [indices.md](./indices.md) (có thể dùng `curl` (rất vất vả) hoặc **Postman**). Trong đó mỗi API được mô tả bằng method, đường dẫn và body request. Lưu ý lúc này hãy bỏ qua các API DELETE.
```bash
curl -X <method> http://localhost:9200/<đường dẫn> -H 'Content-Type: application/json' --data 'body request'
```

## Chạy ứng dụng

Tạo một file `.env` ở gốc thư mục chứa repo, với nội dung:
```
NODE_ENV=development
PORT=3000

# cassandra
CASSANDRA_CONTACT_POINTS=127.0.0.1:9042
CASSANDRA_USERNAME=cassandra
CASSANDRA_PASSWORD=cassandra
LOCAL_DATA_CENTER=DC1
KEYSPACE=lms

# elasticsearch
ELASTICSEARCH_URL=http://127.0.0.1:9200

SESSION_SECRET=1pxQzIAUpikAOuaLII8mc0/z8NqPgugOVcX8+Z7hctW9a65InIoaDTTQ+6yRwpBPptLovt/E5SDO3Mg/0xCi+w==
```

```bash
# nếu dùng yarn
yarn dev

# nếu dùng npm
npm run dev 
```

Ứng dụng web chạy trên cổng 3000
