from setuptools import setup, find_packages
from setuptools.command.install import install as _install
from setuptools import setup
import ssl

class Install(_install):
    def run(self):
        _install.do_egg_install(self)
        import nltk
        try:
            _create_unverified_https_context = ssl._create_unverified_context
        except AttributeError:
            pass
        else:
            ssl._create_default_https_context = _create_unverified_https_context

        nltk.download()

setup(
    cmdclass={'install': Install},
    name='QUADL_PreProcess',
    version='1.1',
    packages=[''],
    install_requires=[
      'nltk',
      ],
    setup_requires=['nltk'],
    url='',
    license='',
    author='pawan',
    author_email='pawan.p.121@gmail.com',
    description=''
)
