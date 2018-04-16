FROM library/postgres
ENV POSTGRES_USER rapidoadmin
ENV POSTGRES_PASSWORD rapidopass
ENV POSTGRES_DB rapido

ADD init.sql /docker-entrypoint-initdb.d/
