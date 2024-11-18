<!-- ssh -i "sisbatas-key.pem" ec2-user@ec2-13-54-188-102.ap-southeast-2.compute.amazonaws.com -->


db: 5432: 20232
fe: 6379: 20279
be: 5000: 20250
minio main/api: 20281
minio gui/console: 9893: 20293 


show all sudo netstat -tulpn
kill port