
export default function isEmptyString(str: string) {
    return !/\S/.test(str);
}