FROM ubuntu:15.10
MAINTAINER MPEG-DASH Rose-SR-Project-Team <rose-sr-project@lists.scientiallc.com>

#get packages
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y \
dvb-apps \
g++ \
git \
firefox-dev \
liba52-0.7.4-dev \
libasound2-dev \
libav-tools \
libavcodec-dev \
libavcodec-extra \
libavdevice-dev \
libavformat-dev \
libavresample-dev \
libavutil-dev \
libdirectfb-dev \
libdirectfb-extra \
libfaad-dev \
libfreetype6-dev \
libgl1-mesa-dev \
libjack-dev \
libjpeg-dev \
libmad0-dev \
libmozjs185-dev \
libogg-dev \
libopenjpeg-dev \
libpng12-dev \
libpulse-dev \
libsdl1.2-dev \
libswscale-dev \
libssl-dev \
libtheora-dev \
libupnp-dev \
libvorbis-dev \
libx264-dev \
libxv-dev \
libxvidcore-dev \
linux-sound-base \
make \
nodejs \
npm \
pkg-config \
x11proto-gl-dev \
x11proto-video-dev \
x264 \
yasm \
zlib1g-dev

#adding files
Add /SampleMP4s/SampleVideo_720x480_50mb.mp4 /
ADD /convertingHostingMedia.sh /
ADD /dashcast.conf /

#get GPAC

RUN git clone https://github.com/gpac/gpac.git /root/gpac
RUN cd /root/gpac && \
./configure && \
make -j5 && \
make install && \
make install-lib

#check out Gpac repo

RUN git clone https://github.com/gpac/node-gpac-dash.git /root/node-gpac-dash
COPY dashcast.conf /root/dashcast.conf
VOLUME /data

CMD sh /etc/postfix/setup.sh; 'bash'
