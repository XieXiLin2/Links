from jinja2 import Template

from pydantic import BaseModel
from pydantic.networks import AnyHttpUrl
from typing import Annotated

from cookit.pyd import type_validate_json

from pathlib import Path

LINK_JSON = Path().cwd() / "links.json"
INDEX_HTML = Path().cwd() / "index.html"
JINJA2_TEMPLATE = Path().cwd() / "index.jinja2"


class FriendLink(BaseModel):
    name: str
    link: Annotated[AnyHttpUrl, str]


class Friend(BaseModel):
    avatar: Annotated[AnyHttpUrl, str]
    name: str
    banner: str
    links: list[FriendLink]


def main():
    friends = type_validate_json(list[Friend], LINK_JSON.read_bytes())
    template = Template(JINJA2_TEMPLATE.read_text(encoding="UTF-8"))
    render = template.render(links=friends).encode("UTF-8")
    print(INDEX_HTML.write_bytes(render))


if __name__ == "__main__":
    main()
