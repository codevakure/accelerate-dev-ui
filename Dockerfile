# specify the node base image with your desired version node:<version>  DPA 
FROM tomcat:8.0 
# COPY appmapping.main.properties appmapping.properties 
#RUN mkdir -p /usr/local/tomcat/webapps/
#RUN value=`cat conf/server.xml` && echo "${value//8080/9091}" >| conf/server.xml
RUN rm -rf /usr/local/tomcat/webapps/ROOT 
RUN mkdir -p /usr/local/tomcat/webapps/acc-ui 
COPY ./dist/HHS-PACD-FRONTEND /usr/local/tomcat/webapps/acc-ui 
# ENV HOST=0.0.0.0
