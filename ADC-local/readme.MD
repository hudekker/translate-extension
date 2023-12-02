## Authentication, on terminal do this:
- gcloud auth application-default login

## For quota there are 2 options, only need to do 1 of them:
1. in the terminal, execute this replacing with your quota project id
export GOOGLE_CLOUD_PROJECT=your-quota-project-id

2. On nodejs, you can set the quota project in the .env
GOOGLE_CLOUD_PROJECT=your-quota-project-id node your-app.js