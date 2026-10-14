# SnapShare: Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed of photos from people they follow.

The estimates use these assumptions:

- Registered users: 10,000,000.
- Daily active users: 10% of registered users.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each photo also has one 50 KB thumbnail.
- A day has approximately 86,400 seconds.
- Peak traffic is 5 times the average traffic.
- All uploaded photos and thumbnails are retained for one year.
- For simple estimates, 1 GB = 1,000 MB and 1 TB = 1,000 GB.

## 2. Load and Storage Estimates

### Daily active users

10,000,000 registered users × 10% = **1,000,000 daily active users (DAU)**.

### Uploads per second

Each active user uploads one photo per day.

1,000,000 × 1 photo = 1,000,000 uploads per day.

1,000,000 ÷ 86,400 ≈ **11.6 uploads per second on average**.

Peak uploads, using 5 times the average:

11.6 × 5 ≈ **58 uploads per second**.

### Feed views per second

Each active user views 50 feed pages per day.

1,000,000 × 50 = 50,000,000 feed views per day.

50,000,000 ÷ 86,400 ≈ **579 feed views per second on average**.

Peak feed views:

579 × 5 ≈ **2,894 feed views per second**.

### Photo storage per year

Each photo uses 2 MB for the original and 50 KB for the thumbnail.

50 KB = 0.05 MB.

Total storage per photo = 2 + 0.05 = 2.05 MB.

Daily photo storage:

1,000,000 photos × 2.05 MB = 2,050,000 MB per day, or approximately 2.05 TB per day.

Yearly photo storage:

2.05 TB × 365 = **748.25 TB per year**, approximately 0.75 PB.

This estimate excludes database records, backups, replication overhead, and temporary files. It assumes one thumbnail per photo and does not include extra storage copies.

## 3. Read-Heavy or Write-Heavy?

SnapShare is **read-heavy** because users view approximately 50 million feed pages per day but upload only 1 million photos per day. Feed views are about 50 times more frequent than uploads.

This means the system should be designed to handle many feed requests efficiently. Caching frequently requested feed data, using a CDN for photo delivery, and adding a database read replica can reduce the load on the main database. Uploads should be processed asynchronously where possible so that thumbnail generation does not delay the user's response.

## 4. Where Should Photos Be Stored?

Photo files should be stored in object storage, such as Amazon S3 or a similar service, rather than directly inside the database.

Photos are large binary files, so storing them in the database would increase its size, backups, and query workload. Object storage is designed to store large files efficiently and durably. The database should store photo metadata, such as the photo ID, owner ID, caption, upload time, and object-storage key or URL.

The CDN can deliver cached copies of photos and thumbnails to users without requiring every view to reach the origin storage.

## 5. Architecture Diagram

```text
                         SNAPSHARE ARCHITECTURE

 Users / Browsers
       |
       +-------------------- Static files and photo requests
       |                                      |
       |                                      v
       |                                +-----------+
       |                                |    CDN    |
       |                                +-----------+
       |                                      |
       |                               Cache miss only
       |                                      |
       v                                      v
 +----------------+                    +-----------------+
 | Load Balancer  |                    | Object Storage  |
 +----------------+                    | Original photos |
       |                                | Thumbnails      |
       |                                +-----------------+
       v
 +-------------+    +-------------+
 | App Server 1|    | App Server 2|
 +-------------+    +-------------+
       |                  |
       +---------+--------+
                 |
        +--------+---------+
        |                  |
        v                  v
 +--------------+   +------------------+
 | Cache        |   | Primary Database |
 | Feed / Redis |   +------------------+
 +--------------+             |
                              | Replication
                              v
                     +------------------+
                     | Read Replica     |
                     +------------------+

       Photo upload processing:
       App Server --> Object Storage (original photo)
            |
            v
       +-------------+       +----------------+
       | Message     | ----> | Thumbnail      |
       | Queue       |       | Worker         |
       +-------------+       +----------------+
                                     |
                                     v
                              Object Storage
                              (thumbnail)
```

## 6. What Each Component Does

- **CDN:** Delivers photos, thumbnails, and static files from nearby edge servers to reduce latency and origin traffic.
- **Load balancer:** Distributes incoming API requests across healthy application servers.
- **Application servers:** Authenticate users, validate uploads, manage feed requests, and coordinate access to storage and databases.
- **Cache:** Stores frequently requested feed data so the application can respond quickly without repeatedly querying the database.
- **Primary database:** Stores authoritative application records, including users, follows, captions, photo metadata, and relationships.
- **Read replica:** Handles suitable read queries to reduce the workload on the primary database.
- **Object storage:** Stores the original photo files and generated thumbnails durably and separately from the database.
- **Message queue:** Holds thumbnail-generation jobs so they can be processed asynchronously without making users wait for the work to finish.
- **Thumbnail worker:** Retrieves queued jobs, creates smaller versions of uploaded photos, and saves the thumbnails to object storage.

## 7. Step-by-Step Photo Upload Flow

1. The user selects a photo and submits it through the application.
2. The load balancer sends the upload request to a healthy application server.
3. The application server authenticates the user and validates the file type, file size, and other upload rules.
4. The original photo is uploaded to object storage, which returns or confirms its storage key.
5. The application server saves the photo metadata and storage key in the primary database.
6. The application server places a thumbnail-generation job on the message queue.
7. The application responds to the user that the upload has been accepted or completed, depending on the upload workflow.
8. A worker retrieves the job and generates a 50 KB thumbnail from the original photo.
9. The worker stores the thumbnail in object storage and updates the photo's processing status if necessary.
10. The CDN can then deliver the original photo and thumbnail to users. If a requested file is not cached, the CDN retrieves it from object storage and may cache it for future requests.

If thumbnail generation fails, the job can be retried rather than requiring the user to upload the original photo again.

## 8. Trade-offs

### Speed versus freshness

Caching feed data makes the application faster and reduces database load. However, a cached feed may not immediately show a newly uploaded photo or a new follow relationship. The system must choose appropriate cache-expiration and invalidation rules.

### Fast uploads versus immediate thumbnail availability

Using a message queue allows the application to accept uploads without waiting for thumbnail generation. The trade-off is that the thumbnail may not be available immediately, so the interface may temporarily show a processing indicator or the original photo.

### Cost versus reliability

Object storage, backups, replicas, and multiple application servers improve durability and availability but increase operating costs. The system should add capacity according to actual traffic, retention requirements, and recovery needs.

### Simplicity versus scalability

A simple deployment is easier to build and maintain, but it may struggle as traffic increases. Adding a CDN, load balancer, read replicas, caching, and background workers introduces complexity but helps SnapShare support more users.

## 9. Conclusion

SnapShare has 1 million daily active users, approximately 11.6 uploads per second on average, 579 feed views per second on average, and about 748 TB of new photo and thumbnail storage per year under the stated assumptions.

Because SnapShare is read-heavy, the architecture prioritizes efficient feed reads and photo delivery through caching, a CDN, and a read replica. Original photos and thumbnails belong in object storage, while the database stores their metadata. A queue and worker handle thumbnail generation asynchronously, allowing the application to respond promptly and process background work separately.