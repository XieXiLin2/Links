# Uncompleted #

from jinja2 import Template

from pydantic import BaseModel, parse_file_as
from pydantic.networks import AnyHttpUrl
from typing import List


class FriendLink(BaseModel):
    name: str
    url: AnyHttpUrl


class Friend(BaseModel):
    avatar: AnyHttpUrl
    name: str
    banner: str
    links: List[FriendLink]


def main():
    friends = parse_file_as(List[Friend], "links.json")
    template = Template(open("template.html").read())
    template.
