"""
Convert CSV language file to JS and PY files
"""
import sys
import csv

SEPERATE_FIELD = ';'
CLIENT_LANG = 'lang.js'
SERVER_LANG = 'i18n.py'

FILE = sys.argv[1]

FIRST = True
LANG_DICT = []
with open(FILE, 'rb') as csvfile:
    LINES = csv.reader(csvfile, delimiter=';', quotechar='"')
    for line in LINES:
        if FIRST:
            # Create the dictionnary for each lang
            for index, lang in enumerate(line):
                if index > 0:
                    code = lang[lang.index('(')+1: lang.index(')')]
                    lang = {
                        'name': lang,
                        'code': code,
                        'values': []
                    }
                    LANG_DICT.append(lang)
            FIRST = False
        else:
            key = line[0]
            for index, value in enumerate(line):
                if index > 0 and key and value:
                    lang = LANG_DICT[index-1]
                    entry = {
                        'key': key.strip(),
                        'value': value.strip()
                    }
                    lang['values'].append(entry)

# Write client file
CLIENT = open(CLIENT_LANG, 'w')

CLIENT.write("angular.module(APPLICATION_NAME).config(['$translateProvider', function($translateProvider)\n")
CLIENT.write("{\n")

for lang in LANG_DICT:
    CLIENT.write("    $translateProvider.translations('" + lang['code'] + "',\n")
    CLIENT.write("        {\n")

    for index, entry in enumerate(lang['values']):
        CLIENT.write('            "' + entry['key'] + '": "' +
                     entry['value'].replace('"', '\\"').replace('\n', '\\n" +\n                ' + (' ' * len(entry['key'])) + '"') + '"')

        if index < len(lang['values'])-1:
            CLIENT.write(",\n")

    CLIENT.write("\n        });\n\n")

CLIENT.write("    $translateProvider.preferredLanguage((navigator.language !== null ? navigator.language : " +
             "navigator.browserLanguage).split(\"_\")[0].split(\"-\")[0]);\n")
CLIENT.write("    $translateProvider.fallbackLanguage('en');\n")
CLIENT.write("}]);")

CLIENT.close()