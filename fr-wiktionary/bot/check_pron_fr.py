import re
import sys
import unicodedata

import PyQt5.QtGui as QtG
import PyQt5.QtWidgets as QtW
import pywikibot
import requests

import wiki_editor.wikieditor as we


class App(QtW.QWidget):
    PRON_PLACEHOLDER = '${PRON}'
    PRON_PLACEHOLDER_1 = '${PRON-1}'
    PRON_PLACEHOLDER_2 = '${PRON-2}'
    PRON_PLACEHOLDERS = [PRON_PLACEHOLDER, PRON_PLACEHOLDER_1, PRON_PLACEHOLDER_2]
    DEFAULT_COMMIT_MESSAGE = 'Ajout automatique de la prononciation'

    def __init__(self):
        # noinspection PyArgumentList
        super().__init__()
        self.setWindowTitle('Prononciateur Français - Wiktionnaire')
        self.setGeometry(0, 0, 640, 480)
        rect = self.frameGeometry()
        rect.moveCenter(QtW.QDesktopWidget().availableGeometry().center())
        self.move(rect.topLeft())
        self.__init_ui()
        self.show()
        self.__init_content()

    def __init_ui(self):
        layout = QtW.QVBoxLayout()

        fields_form = QtW.QFormLayout()
        self.__page_title_label = QtW.QLabel()
        self.__page_title_label.setOpenExternalLinks(True)
        fields_form.addRow(QtW.QLabel('Titre de la page'), self.__page_title_label)
        self.__ipa_pron_label = QtW.QLineEdit()
        self.__ipa_pron_label.setFont(QtG.QFont('DejaVu Sans'))
        fields_form.addRow(QtW.QLabel('Prononciation API'), self.__ipa_pron_label)
        self.__pron_code_field = QtW.QLineEdit()
        # noinspection PyUnresolvedReferences
        self.__pron_code_field.returnPressed.connect(self.__fetch_api_pron)
        fields_form.addRow(QtW.QLabel('Code prononciation'), self.__pron_code_field)
        self.__page_code_field = we.WikiEditor(self.PRON_PLACEHOLDERS)
        policy = self.__page_code_field.sizePolicy()
        policy.setVerticalStretch(1)
        self.__page_code_field.setSizePolicy(policy)
        shortcut = QtW.QShortcut(QtG.QKeySequence("Ctrl+P"), self)
        # noinspection PyUnresolvedReferences
        shortcut.activated.connect(self.__insert_pron)
        fields_form.addRow(QtW.QLabel('Code de la page'), self.__page_code_field)
        self.__commit_message_field = QtW.QLineEdit()
        fields_form.addRow(QtW.QLabel('Message de commit'), self.__commit_message_field)
        layout.addLayout(fields_form)

        button_box = QtW.QDialogButtonBox(QtW.QDialogButtonBox.Apply | QtW.QDialogButtonBox.Ignore)
        button_box.setCenterButtons(True)
        button_box.button(QtW.QDialogButtonBox.Apply).clicked.connect(self.__apply)
        button_box.button(QtW.QDialogButtonBox.Apply).setText('Appliquer')
        button_box.button(QtW.QDialogButtonBox.Ignore).clicked.connect(self.__next)
        button_box.button(QtW.QDialogButtonBox.Ignore).setText('Passer')
        # noinspection PyArgumentList
        layout.addWidget(button_box)

        self.setLayout(layout)

    def __init_content(self):
        site = pywikibot.Site()
        # c = 'Wiktionnaire:Prononciations manquantes en français'
        c = 'Locutions-phrases en français'
        category = pywikibot.Category(site, 'Catégorie:' + c)

        def filter_function(article: pywikibot.Page):
            def strip_accents(s):
                return ''.join((c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn'))

            word = strip_accents(article.title()).lower().replace('’', ' ')
            return not word[0].isdigit() and word >= 'il ne faut pas dire, fontaine, je ne boirai pas de ton eau'

        self.__words_generator = filter(filter_function, category.articles())
        self.__current_page = None
        self.__next()

    def __insert_pron(self):
        cursor = self.__page_code_field.textCursor()
        pos = cursor.position()
        text = self.__page_code_field.toPlainText()
        text = text[:pos] + self.PRON_PLACEHOLDER + text[pos:]
        self.__page_code_field.setText(text)
        cursor.setPosition(pos + len(self.PRON_PLACEHOLDER))
        self.__page_code_field.setTextCursor(cursor)

    def __next(self):
        self.__current_page = next(self.__words_generator)
        page_code = self.__current_page.text
        p = self.PRON_PLACEHOLDER
        p1 = self.PRON_PLACEHOLDER_1
        p2 = self.PRON_PLACEHOLDER_2
        page_code = re.sub(r'{{pron\|\s*?\|(?:lang=)?fr}}', f'{{{{pron|{p}|fr}}}}', page_code)
        page_code = re.sub(r'{{fr-inv\|?(?:pron=)?\s*?}}', fr'{{{{fr-inv|{p}}}}}', page_code)
        page_code = re.sub(r'{{fr-rég\|?(?:pron=)?\s*?(\|.+?)?}}', fr'{{{{fr-rég|{p}\1}}}}', page_code)
        page_code = re.sub(r'{{fr-accord-rég\|?(?:pron=)?\s*?(\|.+?)?}}', fr'{{{{fr-accord-rég|{p}\1}}}}', page_code)
        page_code = re.sub(r'{{fr-accord-s\|?(?:pron=)?\s*?(\|.+?)?}}', fr'{{{{fr-accord-s|{p}\1}}}}', page_code)
        page_code = re.sub(r'{{fr-accord-al\|?(?:pron=)?\s*?(\|.+?)?}}', fr'{{{{fr-accord-al|{p1}\1}}}}', page_code)
        page_code = re.sub(r'{{fr-accord-en\|?(?:pron=)?\s*?(\|.+?)?}}', fr'{{{{fr-accord-en|{p2}\1}}}}', page_code)
        self.__page_code_field.setText(page_code)
        nb = page_code.count(self.PRON_PLACEHOLDER)
        word = self.__current_page.title()
        escaped_url = word.replace('?', '%3F')
        self.__page_title_label.setText(
            f'<a href="https://fr.wiktionary.org/wiki/{escaped_url}">{word}</a> ({nb} modèle(s) à compléter)')
        self.__commit_message_field.setText(self.DEFAULT_COMMIT_MESSAGE)

    def __fetch_api_pron(self):
        code = self.__pron_code_field.text()
        try:
            ipa_code = self.__get_pron(code)
        except ValueError as e:
            # noinspection PyArgumentList
            QtW.QMessageBox.critical(None, 'Erreur', str(e))
        else:
            self.__ipa_pron_label.setText(ipa_code)

    def __apply(self):
        page_code = self.__page_code_field.toPlainText()
        pron = self.__ipa_pron_label.text()
        if pron == '' and (self.PRON_PLACEHOLDER in page_code or self.PRON_PLACEHOLDER_1 in page_code):
            # noinspection PyArgumentList
            QtW.QMessageBox.critical(None, 'Erreur', 'Prononciation manquante')
        else:
            for i, placeholder in enumerate(self.PRON_PLACEHOLDERS):
                s = slice(0, -i) if i > 0 else slice(len(pron) + 1)
                page_code = page_code.replace(placeholder, pron[s])
            self.__current_page.text = page_code
            self.__current_page.save(summary=self.__commit_message_field.text(), watch='nochange', minor=True,
                                     botflag=True)
            self.__next()

    @staticmethod
    def __get_pron(pron_code: str) -> str:
        url = 'http://darmo-creations.herokuapp.com/ipa-generator/to-ipa/'
        response = requests.get(url, params={'input': pron_code})
        json = response.json()
        if 'error' in json:
            raise ValueError(json['error'])
        return json['ipa_code']


if __name__ == '__main__':
    app = QtW.QApplication(sys.argv)
    ex = App()
    sys.exit(app.exec_())
