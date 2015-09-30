FROM fedora:20
MAINTAINER MPEG-DASH Rose-SR-Project-Team <rose-sr-project@lists.scientiallc.com>

RUN yum update
RUN yum clean all

RUN yum -y install wget
RUN yum -y install which
RUN yum -y install make
RUN yum -y install freeglut.x86_64  freeglut-devel.x86_64
RUN cd /usr/local/src ; wget ftp://ftp.gnome.org/mirror/temp/sf2015/g/gp/gpac/GPAC/GPAC%200.4.5/gpac-0.4.5.tar.gz ; wget ftp://ftp.gnome.org/mirror/temp/sf2015/g/gp/gpac/GPAC%20extra%20libs/GPAC%20extra%20libs%200.4.5/gpac_extra_libs-0.4.5.tar.gz ; tar -zxvf gpac-0.4.5.tar.gz ; tar -zxvf gpac_extra_libs-0.4.5.tar.gz
RUN cd /usr/local/src/gpac_extra_libs ; cp -prf * /usr/local/src/gpac/extra_lib
RUN yum -y install zlib*
RUN yum -y install gcc-c++
RUN cd /usr/local/src/gpac ; chmod 755 configure
RUN cd /usr/local/src/gpac ; ./configure
RUN cd /usr/local/src/gpac ; make lib
RUN cd /usr/local/src/gpac ; make apps
RUN cd /usr/local/src/gpac ; make install lib
RUN cd /usr/local/src/gpac ; make install
RUN cp -prf bin/gcc/libgpac.so /usr/lib64 ; ldconfig
RUN which MP4Box
