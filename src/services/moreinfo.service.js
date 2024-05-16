const info = {
    'vegetables': '',
    'backing-products': '',
    'dairy': '',
    'legumes': '',
    'nuts-and-seeds': '',
    'condiments': '',
    'cooking-oils': '',
    'dairy-replacements': '',
    'bread': '',
    'spices-and-seasonings': '',
    'backing-products': '',
    'beverages': '',
    'alcohol': '',
    'meat-and-poultry': '',
    'fruit': {
        he: {
            info: `כשהם בצורתם הטבעית, חלקם עתירי סוכר פירות וחלקם לא ועדיין כולם מכילים ויטמינים נחוצים, מים וסיבים. 
        הם יכולים להשתלב בסלטים, תבשילים, מאכלים וקינוחים מתוקים. הדרך הטרייה והמועדפת לאכול אותם היא בביסים בכדי לאפשר את הלעיסה החשובה לתהליך העיכול, מבנה הלסת והמוח.
        אי אכילה של פירות מפחיתה משמעותית את היכולת שלנו לקבל מהאוכל שלנו תחושת חיות אנרגטית וקלילות. 
        תפקיד הפירות לנחם, להעיר (במיוחד הטעמים החמוצים), לרענן, להקליל ולשמח. 
        הם הכי טובים לצד חלבונים ושומנים שם יוכלו לתפקד כפחמימה שמרימה את האנרגיה ולא מורידים.`,
            title: 'פירות',
        },
        en: {
            info: `When in their natural form, some are high in fruit sugar and some are not and yet all contain necessary vitamins, water and fiber.
        They can be integrated into salads, stews, foods and sweet desserts. The freshest and preferred way to eat them is in bites to allow chewing which is important for the digestive process, the structure of the jaw and the brain.
        Not eating fruit significantly reduces our ability to receive from our food a feeling of vitality and lightness.
        The role of fruits is to comfort, awaken (especially the sour flavors), refresh, lighten and make you happy.
        They are best next to proteins and fats where they can function as a carbohydrate that raises the energy and does not lower it.`,
            title: 'Fruit'
        },

        es: {
            info: `Cuando están en su forma natural, algunas tienen un alto contenido de azúcar de frutas y otras no, pero todas contienen las vitaminas, el agua y la fibra necesarias.
        Se pueden integrar en ensaladas, guisos, comidas y postres dulces. La forma más fresca y preferida de comerlos es en bocados para permitir la masticación, lo cual es importante para el proceso digestivo, la estructura de la mandíbula y el cerebro.
        No comer fruta reduce significativamente nuestra capacidad de recibir de nuestros alimentos una sensación de vitalidad y ligereza.
        La función de las frutas es reconfortar, despertar (especialmente los sabores ácidos), refrescar, aligerar y hacerte feliz.
        Están mejor junto a proteínas y grasas donde pueden funcionar como un carbohidrato que aumenta la energía y no la reduce.`,
            title: 'Fruta'
        }
    },
    'grains': '',
    'fish-and-seafood': '',
    'sweeteners': '',

}

export const moreInfoService = {
    getInfoByLabel: (label, currLang) => {
        console.log('label', label, 'currLang', currLang);

        console.log(info[label]['he']);
        return info[label][currLang];
    }
}





