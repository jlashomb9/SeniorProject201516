FROM ubuntu:latest
MAINTAINER MPEG-DASH Rose-SR-Project-Team <rose-sr-project@lists.scientiallc.com>

RUN apt-get -y update
RUN apt-get -y install wget
#RUN cd home ; mkdir Downloads ; cd Downloads ; wget http://download.tsi.telecom-paristech.fr/gpac/latest_builds/linux64/libgpac-dev/libgpac-dev_0.5.2-DEV-rev705-gab2043f-master_amd64.deb

#RUN apt-get -y install gdebi-core
#RUN cd home/Downloads ; gdebi --option=APT::Get::force-yes=1,APT::Get::Assume-Yes=1 -n libgpac-dev_0.5.2-DEV-rev705-gab2043f-master_amd64.deb
ADD /SampleMP4s/SampleVideo_720x480_50mb.mp4 /

RUN apt-get -y install gpac
RUN apt-get -y install libx264-dev
RUN apt-get -y install yasm
RUN apt-get -y install git
RUN apt-get -y install subversion
RUN apt-get -y install build-essential
RUN apt-get install -y make pkg-config g++ zlib1g-dev firefox-dev libfreetype6-dev libjpeg62-dev libpng12-dev libopenjpeg-dev libmad0-dev libfaad-dev libogg-dev libvorbis-dev libtheora-dev liba52-0.7.4-dev libavcodec-dev libavformat-dev libavutil-dev libswscale-dev libavresample-dev libxv-dev x11proto-video-dev libgl1-mesa-dev x11proto-gl-dev linux-sound-base libxvidcore-dev libssl-dev libjack-dev libasound2-dev libpulse-dev libsdl1.2-dev dvb-apps libavcodec-extra-54 libavdevice-dev libmozjs185-dev
RUN apt-get -y upgrade

RUN cd home ; git clone git://source.ffmpeg.org/ffmpeg.git ffmpeg
RUN cd home ; svn co svn://svn.code.sf.net/p/gpac/code/trunk/gpac gpac
RUN cd home/ffmpeg ; ./configure --enable-gpl --enable-shared --disable-debug --enable-libx264 --enable-avresample
RUN cd home/ffmpeg ; make -j
RUN cd home/ffmpeg ; make install

RUN cd home/gpac ; ./configure --enable-shared
RUN cd home/gpac ; make
RUN cd home/gpac ; make install
RUN cd home/gpac ; make install-lib

RUN which DashCast
RUN which MP4Box
