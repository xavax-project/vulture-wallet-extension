

export async function hasFlag(bitField: any, flag: number): Promise<boolean> {
    return (bitField & flag) === flag ? true : false;
}