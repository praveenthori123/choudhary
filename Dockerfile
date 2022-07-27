FROM node:16.16.0
RUN mkdir -p /home/app

COPY ./ /home/app



# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install --force
RUN npm install -g @angular/cli
COPY . .


CMD ["ng","serve",]
