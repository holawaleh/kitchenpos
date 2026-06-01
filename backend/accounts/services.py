import random
import string


def generate_temporary_password():

    characters = string.ascii_uppercase + string.digits

    return "".join(random.choice(characters) for _ in range(8))
